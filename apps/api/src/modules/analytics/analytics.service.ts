import { Injectable } from '@nestjs/common';
import { CustomerStage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [totalCustomers, stageGroups, deals, topSalesRaw] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.groupBy({ by: ['stage'], _count: { _all: true } }),
      this.prisma.deal.findMany({ include: { motorModel: true } }),
      this.prisma.deal.groupBy({
        by: ['salespersonId'],
        _count: { _all: true },
        _sum: { unitSold: true },
        orderBy: { _count: { salespersonId: 'desc' } },
        take: 5,
      }),
    ]);

    const pipelineByStage = Object.values(CustomerStage).reduce(
      (acc, stage) => {
        acc[stage] = stageGroups.find((g) => g.stage === stage)?._count._all ?? 0;
        return acc;
      },
      {} as Record<CustomerStage, number>,
    );

    const totalDeals = deals.length;
    const totalRejected = pipelineByStage[CustomerStage.REJECTED];
    const closedCount = totalDeals + totalRejected;
    const conversionRate =
      closedCount > 0 ? Number(((totalDeals / closedCount) * 100).toFixed(2)) : 0;
    const totalRevenue = deals.reduce((sum, d) => sum + d.finalPrice * d.unitSold, 0);
    const totalUnitSold = deals.reduce((sum, d) => sum + d.unitSold, 0);

    const salespersonIds = topSalesRaw.map((s) => s.salespersonId);
    const salespersons = await this.prisma.user.findMany({
      where: { id: { in: salespersonIds } },
      select: { id: true, name: true },
    });

    const topSalespersons = topSalesRaw.map((s) => ({
      salespersonId: s.salespersonId,
      name: salespersons.find((u) => u.id === s.salespersonId)?.name ?? 'Unknown',
      totalDeals: s._count._all,
      totalUnitSold: s._sum.unitSold ?? 0,
    }));

    return {
      totalCustomers,
      pipelineByStage,
      totalDeals,
      totalRejected,
      conversionRate,
      totalRevenue,
      totalUnitSold,
      topSalespersons,
    };
  }

  async getPipeline() {
    const stageGroups = await this.prisma.customer.groupBy({
      by: ['stage'],
      _count: { _all: true },
    });

    return Object.values(CustomerStage).map((stage) => ({
      stage,
      count: stageGroups.find((g) => g.stage === stage)?._count._all ?? 0,
    }));
  }
}
