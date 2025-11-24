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
  async create(@Body() createMoradorDto: CreateMoradorDto) {
    return await this.moradorService.create(createMoradorDto);
  }

  @Get()
  async findAll() {
    return await this.moradorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.moradorService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMoradorDto: UpdateMoradorDto,
  ) {
    return await this.moradorService.update(+id, updateMoradorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.moradorService.remove(+id);
  }
}
