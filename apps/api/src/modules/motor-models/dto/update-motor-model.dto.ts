import { PartialType } from '@nestjs/mapped-types';
import { CreateMotorModelDto } from './create-motor-model.dto';

export class UpdateMotorModelDto extends PartialType(CreateMotorModelDto) {}
