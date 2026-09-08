import { PrismaClient, CustomerStage, CustomerSource, InteractionType, InteractionResult, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const STAGE_ORDER: CustomerStage[] = [
  CustomerStage.NEW,
  CustomerStage.CONTACTED,
  CustomerStage.FOLLOWED_UP,
  CustomerStage.PRESENTED,
  CustomerStage.DEAL,
];

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  console.log('🌱 Seeding started...');

  await prisma.deal.deleteMany();
  await prisma.stageHistory.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.motorModel.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all(
    [
      { name: 'Nova Andriana', email: 'nova.andriana@cjms.id', role: Role.ADMIN },
      { name: 'Siti Nurhaliza', email: 'siti.nurhaliza@cjms.id', role: Role.SALES },
      { name: 'Andi Wijaya', email: 'andi.wijaya@cjms.id', role: Role.SALES },
      { name: 'Rina Marlina', email: 'rina.marlina@cjms.id', role: Role.SALES },
    ].map((u) =>
      prisma.user.create({
        data: { ...u, password: hashedPassword },
      }),
    ),
  );
  const salespersons = users.filter((u) => u.role === Role.SALES);
  console.log(`✅ Created ${users.length} users`);

  const motorModels = await Promise.all(
    [
      { name: 'Gesits G1', price: 28_700_000, stockQty: 12 },
      { name: 'Alva Cervo', price: 39_900_000, stockQty: 8 },
      { name: 'Volta 401', price: 16_500_000, stockQty: 20 },
      { name: 'Selis E-Max', price: 14_900_000, stockQty: 15 },
      { name: 'United T1800', price: 21_200_000, stockQty: 10 },
      { name: 'Polytron Fox R', price: 24_800_000, stockQty: 9 },
    ].map((m) => prisma.motorModel.create({ data: m })),
  );
  console.log(`✅ Created ${motorModels.length} motor models`);

  const customerNames = [
    'Ahmad Fauzi', 'Dewi Lestari', 'Rudi Hartono', 'Maya Sari', 'Eko Prasetyo',
    'Indah Permata', 'Joko Susilo', 'Lina Wati', 'Hendra Gunawan', 'Fitri Handayani',
    'Agus Salim', 'Wulan Dari', 'Bambang Setiawan', 'Yuni Astuti', 'Dedi Kurniawan',
    'Nita Rahmawati', 'Fajar Nugroho', 'Sri Wahyuni', 'Iwan Setiadi', 'Ratna Sari',
  ];

  const sources = Object.values(CustomerSource);
  const interactionNotes: Record<string, string[]> = {
    CALL: ['Menghubungi customer untuk perkenalan produk', 'Follow up via telepon terkait minat pembelian'],
    WHATSAPP: ['Mengirim katalog motor listrik via WhatsApp', 'Chat WA menanyakan kebutuhan customer'],
    EMAIL: ['Mengirim brosur dan simulasi kredit via email'],
    MEETING: ['Bertemu customer di showroom untuk konsultasi'],
    PRESENTATION: ['Presentasi produk dan test ride di showroom'],
    FOLLOW_UP: ['Follow up ulang karena customer masih mempertimbangkan'],
    NOTE: ['Customer meminta waktu untuk diskusi dengan keluarga'],
  };

  let dealCount = 0;
  let rejectCount = 0;

  for (let i = 0; i < customerNames.length; i++) {
    const name = customerNames[i];
    const salesperson = salespersons[i % salespersons.length];
    const motor = motorModels[i % motorModels.length];
    const source = sources[i % sources.length] as CustomerSource;

    // Tentukan final stage: distribusi realistis
    let finalStage: CustomerStage;
    const mod = i % 7;
    if (mod === 6) {
      finalStage = CustomerStage.REJECTED;
      rejectCount++;
    } else if (mod === 5) {
      finalStage = CustomerStage.DEAL;
      dealCount++;
    } else {
      finalStage = STAGE_ORDER[mod % STAGE_ORDER.length];
    }

    const createdAt = daysAgo(30 - i);

    const customer = await prisma.customer.create({
      data: {
        name,
        phone: `08${String(1000000000 + i * 137).slice(0, 10)}`,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        address: `Jl. Raya No. ${i + 1}, Purwakarta, Jawa Barat`,
        source,
        stage: finalStage === CustomerStage.REJECTED ? CustomerStage.REJECTED : finalStage,
        interestedMotorId: motor.id,
        salespersonId: salesperson.id,
        createdAt,
      },
    });

    // Bangun progresi stage yang konsisten (dari NEW sampai finalStage)
    const progression: CustomerStage[] =
      finalStage === CustomerStage.REJECTED
        ? [CustomerStage.NEW, CustomerStage.CONTACTED, CustomerStage.FOLLOWED_UP, CustomerStage.REJECTED]
        : STAGE_ORDER.slice(0, STAGE_ORDER.indexOf(finalStage) + 1);

    let prevStage: CustomerStage | null = null;
    for (let step = 0; step < progression.length; step++) {
      const stage = progression[step];
      if (prevStage) {
        await prisma.stageHistory.create({
          data: {
            customerId: customer.id,
            changedById: salesperson.id,
            fromStage: prevStage,
            toStage: stage,
            notes: `Perpindahan stage dari ${prevStage} ke ${stage}`,
            changedAt: daysAgo(30 - i - step),
          },
        });
      }

      const typeForStage: InteractionType =
        stage === CustomerStage.CONTACTED ? InteractionType.CALL
        : stage === CustomerStage.FOLLOWED_UP ? InteractionType.FOLLOW_UP
        : stage === CustomerStage.PRESENTED ? InteractionType.PRESENTATION
        : stage === CustomerStage.REJECTED ? InteractionType.NOTE
        : InteractionType.WHATSAPP;

      if (stage !== CustomerStage.NEW) {
        const notesPool = interactionNotes[typeForStage] ?? ['Interaksi dengan customer'];
        await prisma.interaction.create({
          data: {
            customerId: customer.id,
            userId: salesperson.id,
            type: typeForStage,
            result:
              stage === CustomerStage.REJECTED
                ? InteractionResult.NEGATIVE
                : stage === CustomerStage.DEAL
                ? InteractionResult.POSITIVE
                : InteractionResult.NEUTRAL,
            notes: notesPool[i % notesPool.length],
            followUpDate: stage === CustomerStage.FOLLOWED_UP ? daysAgo(30 - i - step - 3) : null,
            createdAt: daysAgo(30 - i - step),
          },
        });
      }

      prevStage = stage;
    }

    if (finalStage === CustomerStage.DEAL) {
      await prisma.deal.create({
        data: {
          customerId: customer.id,
          motorModelId: motor.id,
          salespersonId: salesperson.id,
          finalPrice: motor.price,
          unitSold: 1,
          dealDate: daysAgo(30 - i - progression.length),
          notes: 'Deal closing setelah presentasi dan negosiasi harga',
        },
      });
    }
  }

  console.log(`✅ Created ${customerNames.length} customers (${dealCount} deals, ${rejectCount} rejected)`);
  console.log('🎉 Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });