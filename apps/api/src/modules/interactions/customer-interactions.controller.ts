import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('customers/:customerId/interactions')
export class CustomerInteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  create(@Param('customerId') customerId: string, @Body() dto: CreateInteractionDto) {
    return this.interactionsService.create(customerId, dto);
  }

  @Get()
  findAll(@Param('customerId') customerId: string, @Query() query: PaginationQueryDto) {
    return this.interactionsService.findByCustomer(customerId, query);
  }
}
