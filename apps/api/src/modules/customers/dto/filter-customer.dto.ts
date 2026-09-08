import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CustomerSource, CustomerStage } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FilterCustomerDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(CustomerStage)
  stage?: CustomerStage;

  @IsOptional()
  @IsEnum(CustomerSource)
  source?: CustomerSource;

  @IsOptional()
  @IsUUID()
  salespersonId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
