import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CloseDealDto {
  @IsInt()
  @Min(0)
  finalPrice: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  unitSold?: number;

  @IsUUID()
  @IsNotEmpty()
  salespersonId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
