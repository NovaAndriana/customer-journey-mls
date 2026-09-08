import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { CustomerInteractionsController } from './customer-interactions.controller';

@Module({
  controllers: [InteractionsController, CustomerInteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
