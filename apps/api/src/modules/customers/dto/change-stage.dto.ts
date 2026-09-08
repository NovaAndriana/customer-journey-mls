import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CustomerStage } from '@prisma/client';

export class ChangeStageDto {
  @IsEnum(CustomerStage)
  toStage: CustomerStage;

  @IsUUID()
  @IsNotEmpty()
  changedById: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
