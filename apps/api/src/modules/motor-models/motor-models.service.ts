import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMotorModelDto } from './dto/create-motor-model.dto';
import { UpdateMotorModelDto } from './dto/update-motor-model.dto';
import { FindMotorModelsDto } from './dto/find-motor-models.dto';
import { buildPaginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class MotorModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMotorModelDto) {
    return this.prisma.motorModel.create({ data: dto });
  }

  async findAll(query: FindMotorModelsDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = query;
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.motorModel.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.motorModel.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const motorModel = await this.prisma.motorModel.findUnique({ where: { id } });
    if (!motorModel) throw new NotFoundException(`Motor model dengan id ${id} tidak ditemukan`);
    return motorModel;
  }

  async update(id: string, dto: UpdateMotorModelDto) {
    await this.findOne(id);
    return this.prisma.motorModel.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.motorModel.delete({ where: { id } });
  }
}