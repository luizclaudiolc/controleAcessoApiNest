import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';
import { MoradorService } from './morador.service';

@Controller('morador')
export class MoradorController {
  constructor(private readonly moradorService: MoradorService) {}

  @Post()
  create(@Body() createMoradorDto: CreateMoradorDto) {
    return this.moradorService.create(createMoradorDto);
  }

  @Get()
  findAll() {
    return this.moradorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moradorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoradorDto: UpdateMoradorDto) {
    return this.moradorService.update(+id, updateMoradorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moradorService.remove(+id);
  }
}
