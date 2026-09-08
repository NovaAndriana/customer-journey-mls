import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MotorModelsService } from './motor-models.service';
import { CreateMotorModelDto } from './dto/create-motor-model.dto';
import { UpdateMotorModelDto } from './dto/update-motor-model.dto';
import { FindMotorModelsDto } from './dto/find-motor-models.dto';

@Controller('motor-models')
export class MotorModelsController {
  constructor(private readonly motorModelsService: MotorModelsService) {}

  @Post()
  create(@Body() dto: CreateMotorModelDto) {
    return this.motorModelsService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindMotorModelsDto) {
    return this.motorModelsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motorModelsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMotorModelDto) {
    return this.motorModelsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motorModelsService.remove(id);
  }
}