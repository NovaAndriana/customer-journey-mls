import { Module } from '@nestjs/common';
import { MotorModelsService } from './motor-models.service';
import { MotorModelsController } from './motor-models.controller';

@Module({
  controllers: [MotorModelsController],
  providers: [MotorModelsService],
})
export class MotorModelsModule {}
