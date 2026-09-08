import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CustomerSource } from '@prisma/client';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(CustomerSource)
  source: CustomerSource;

  @IsOptional()
  @IsUUID()
  interestedMotorId?: string;

  @IsUUID()
  @IsNotEmpty()
  salespersonId: string;
}
