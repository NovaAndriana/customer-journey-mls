import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { buildPaginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class InteractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, dto: CreateInteractionDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException(`Customer dengan id ${customerId} tidak ditemukan`);

    return this.prisma.interaction.create({
      data: {
        ...dto,
        customerId,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findByCustomer(customerId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const [items, total] = await Promise.all([
      this.prisma.interaction.findMany({
        where: { customerId },
        include: { user: { select: { id: true, name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.interaction.count({ where: { customerId } }),
    ]);

    return { items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findUpcomingFollowUps(salespersonId?: string) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.prisma.interaction.findMany({
      where: {
        followUpDate: { lte: endOfToday, not: null },
        ...(salespersonId ? { customer: { salespersonId } } : {}),
      },
      include: {
        customer: { select: { id: true, name: true, phone: true, stage: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { followUpDate: 'asc' },
    });
  }
}
