import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerStage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { ChangeStageDto } from './dto/change-stage.dto';
import { CloseDealDto } from './dto/close-deal.dto';
import { buildPaginationMeta } from '../../common/helpers/pagination.helper';

const VALID_TRANSITIONS: Record<CustomerStage, CustomerStage[]> = {
  [CustomerStage.NEW]: [CustomerStage.CONTACTED, CustomerStage.REJECTED],
  [CustomerStage.CONTACTED]: [
    CustomerStage.FOLLOWED_UP,
    CustomerStage.PRESENTED,
    CustomerStage.REJECTED,
  ],
  [CustomerStage.FOLLOWED_UP]: [
    CustomerStage.PRESENTED,
    CustomerStage.CONTACTED,
    CustomerStage.REJECTED,
  ],
  [CustomerStage.PRESENTED]: [
    CustomerStage.DEAL,
    CustomerStage.FOLLOWED_UP,
    CustomerStage.REJECTED,
  ],
  [CustomerStage.DEAL]: [],
  [CustomerStage.REJECTED]: [],
};

const CUSTOMER_INCLUDE = {
  interestedMotor: true,
  salesperson: { select: { id: true, name: true, email: true } },
  deal: { include: { motorModel: true } },
};

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: dto,
      include: CUSTOMER_INCLUDE,
    });
  }

  async findAll(query: FilterCustomerDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      stage,
      source,
      salespersonId,
      search,
    } = query;

    const where: Record<string, unknown> = {};
    if (stage) where.stage = stage;
    if (source) where.source = source;
    if (salespersonId) where.salespersonId = salespersonId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: CUSTOMER_INCLUDE,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        ...CUSTOMER_INCLUDE,
        interactions: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true } } },
        },
        stageHistory: {
          orderBy: { changedAt: 'desc' },
          include: { changedBy: { select: { id: true, name: true } } },
        },
      },
    });
    if (!customer) throw new NotFoundException(`Customer dengan id ${id} tidak ditemukan`);
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.getOrThrow(id);
    return this.prisma.customer.update({
      where: { id },
      data: dto,
      include: CUSTOMER_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.getOrThrow(id);
    return this.prisma.customer.delete({ where: { id } });
  }

  async changeStage(id: string, dto: ChangeStageDto) {
    const customer = await this.getOrThrow(id);

    if (dto.toStage === CustomerStage.DEAL) {
      throw new BadRequestException(
        'Gunakan endpoint POST /customers/:id/deal untuk menutup deal (memerlukan data harga & unit)',
      );
    }

    const allowedNext = VALID_TRANSITIONS[customer.stage];
    if (!allowedNext.includes(dto.toStage)) {
      throw new BadRequestException(
        `Perpindahan stage dari ${customer.stage} ke ${dto.toStage} tidak valid. Stage yang diizinkan: ${
          allowedNext.join(', ') || 'tidak ada (stage final)'
        }`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.customer.update({
        where: { id },
        data: { stage: dto.toStage },
        include: CUSTOMER_INCLUDE,
      });

      await tx.stageHistory.create({
        data: {
          customerId: id,
          changedById: dto.changedById,
          fromStage: customer.stage,
          toStage: dto.toStage,
          notes: dto.notes,
        },
      });

      return updated;
    });
  }

  async closeDeal(id: string, dto: CloseDealDto) {
    const customer = await this.getOrThrow(id);

    const allowedNext = VALID_TRANSITIONS[customer.stage];
    if (!allowedNext.includes(CustomerStage.DEAL)) {
      throw new BadRequestException(
        `Customer pada stage ${customer.stage} tidak bisa langsung di-deal-kan. Stage yang diizinkan: ${
          allowedNext.join(', ') || 'tidak ada (stage final)'
        }`,
      );
    }
    if (!customer.interestedMotorId) {
      throw new BadRequestException(
        'Customer belum memiliki motor yang diminati (interestedMotorId kosong)',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const motor = await tx.motorModel.findUnique({
        where: { id: customer.interestedMotorId! },
      });
      if (!motor) throw new NotFoundException('Motor model tidak ditemukan');

      const unitSold = dto.unitSold ?? 1;
      if (motor.stockQty < unitSold) {
        throw new BadRequestException(
          `Stok motor ${motor.name} tidak mencukupi (sisa ${motor.stockQty})`,
        );
      }

      await tx.motorModel.update({
        where: { id: motor.id },
        data: { stockQty: { decrement: unitSold } },
      });

      const updatedCustomer = await tx.customer.update({
        where: { id },
        data: { stage: CustomerStage.DEAL },
        include: CUSTOMER_INCLUDE,
      });

      await tx.stageHistory.create({
        data: {
          customerId: id,
          changedById: dto.salespersonId,
          fromStage: customer.stage,
          toStage: CustomerStage.DEAL,
          notes: dto.notes ?? 'Deal berhasil ditutup',
        },
      });

      const deal = await tx.deal.create({
        data: {
          customerId: id,
          motorModelId: motor.id,
          salespersonId: dto.salespersonId,
          finalPrice: dto.finalPrice,
          unitSold,
          notes: dto.notes,
        },
        include: { motorModel: true },
      });

      return { customer: updatedCustomer, deal };
    });
  }

  private async getOrThrow(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer dengan id ${id} tidak ditemukan`);
    return customer;
  }
}
