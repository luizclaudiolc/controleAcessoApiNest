import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePorteiroDto } from './dto/create-morador.dto';
import { UpdatePorteiroDto } from './dto/update-morador.dto';
import { PorteiroService } from './porteiro.service';

@Controller('porteiro')
export class PorteiroController {
  constructor(private readonly porteiroService: PorteiroService) {}

  @Post()
  @ApiTags('Porteiro')
  @ApiBody({ type: CreatePorteiroDto })
  @ApiResponse({ status: 201, description: 'Porteiro criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createPorteiro(@Body() createPorteiroDto: CreatePorteiroDto) {
    return await this.porteiroService.createPorteiro(createPorteiroDto);
  }

  @Get()
  @ApiTags('Porteiro')
  @ApiOperation({ summary: 'Lista todos os porteiros' })
  @ApiResponse({ status: 200, description: 'Lista de porteiros' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async getTodosPorteiros() {
    return await this.porteiroService.getTodosPorteiros();
  }

  @Get(':id')
  @ApiTags('Porteiro')
  @ApiOperation({ summary: 'Obtém um porteiro pelo ID' })
  @ApiResponse({ status: 200, description: 'Porteiro encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Porteiro não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async getPorteiroById(@Param('id') id: string) {
    return await this.porteiroService.getPorteiroById(+id);
  }

  @Patch(':id')
  @ApiTags('Porteiro')
  @ApiBody({ type: UpdatePorteiroDto })
  @ApiOperation({ summary: 'Atualiza um porteiro pelo ID' })
  @ApiResponse({ status: 200, description: 'Porteiro atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Porteiro não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updatePorteiro(
    @Param('id') id: string,
    @Body() updatePorteiroDto: UpdatePorteiroDto,
  ) {
    return await this.porteiroService.updatePorteiro(+id, updatePorteiroDto);
  }

  @Delete(':id')
  @ApiTags('Porteiro')
  @ApiOperation({ summary: 'Deleta um porteiro pelo ID' })
  @ApiResponse({ status: 200, description: 'Porteiro deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Porteiro não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async deletePorteiro(@Param('id') id: string) {
    return await this.porteiroService.deletePorteiro(+id);
  }
}
