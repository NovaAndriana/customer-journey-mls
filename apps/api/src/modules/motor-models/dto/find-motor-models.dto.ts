import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindMotorModelsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}