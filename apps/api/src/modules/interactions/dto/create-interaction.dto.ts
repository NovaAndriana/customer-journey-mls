import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { InteractionType, InteractionResult } from '@prisma/client';

export class CreateInteractionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(InteractionType)
  type: InteractionType;

  @IsOptional()
  @IsEnum(InteractionResult)
  result?: InteractionResult;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}
