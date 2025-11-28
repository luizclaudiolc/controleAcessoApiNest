import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VisitanteService } from './visitante.service';
import {
  CreateVisitanteDto,
  RegistrarSaidaDto,
} from './dto/create-visitante.dto';
import { UpdateVisitanteDto } from './dto/update-visitante.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('visitante')
export class VisitanteController {
  constructor(private readonly visitanteService: VisitanteService) {}

  @ApiOperation({ summary: 'Cria um novo visitante' })
  @ApiResponse({ status: 201, description: 'Visitante criado com sucesso' })
  @Post()
  create(@Body() createVisitanteDto: CreateVisitanteDto) {
    return this.visitanteService.create(createVisitanteDto);
  }

  @ApiOperation({ summary: 'Lista todos os visitantes' })
  @ApiResponse({ status: 200, description: 'Lista de visitantes' })
  @Get()
  findAll() {
    return this.visitanteService.findAll();
  }

  @ApiOperation({ summary: 'Lista visitantes com registro em aberto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de visitantes com registro em aberto',
  })
  @Get('em-aberto')
  @ApiOperation({ summary: 'Lista visitantes com registro em aberto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de visitantes com registro em aberto',
  })
  findVisitantesEmAberto() {
    return this.visitanteService.findVisitantesEmAberto();
  }

  @ApiOperation({ summary: 'Busca um visitante pelo ID' })
  @ApiResponse({ status: 200, description: 'Visitante encontrado pelo ID' })
  @ApiResponse({ status: 404, description: 'Visitante não encontrado' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do visitante' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitanteService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza um visitante' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do visitante' })
  @ApiParam({
    name: 'body',
    type: UpdateVisitanteDto,
    description: 'Dados para atualização',
  })
  @ApiResponse({ status: 200, description: 'Visitante atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Visitante não encontrado' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisitanteDto: UpdateVisitanteDto,
  ) {
    return this.visitanteService.update(+id, updateVisitanteDto);
  }

  @ApiOperation({ summary: 'Remove um visitante' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do visitante' })
  @ApiResponse({ status: 200, description: 'Visitante removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Visitante não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitanteService.remove(+id);
  }

  @Post(':id/saida')
  @ApiOperation({ summary: 'Registra a saída de um visitante' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do visitante' })
  @ApiParam({
    name: 'body',
    type: RegistrarSaidaDto,
    description: 'ID do porteiro que registrou a saída',
  })
  @ApiResponse({ status: 200, description: 'Saída registrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Visitante não encontrado' })
  registrarSaida(
    @Param('id') id: string,
    @Body() registrarSaidaDto: RegistrarSaidaDto,
  ) {
    return this.visitanteService.registrarSaida(
      +id,
      registrarSaidaDto.porteiroId,
    );
  }
}
