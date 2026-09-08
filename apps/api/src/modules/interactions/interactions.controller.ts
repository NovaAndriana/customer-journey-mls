import { Controller, Get, Query } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Get('follow-ups')
  findUpcomingFollowUps(@Query('salespersonId') salespersonId?: string) {
    return this.interactionsService.findUpcomingFollowUps(salespersonId);
  }
}
