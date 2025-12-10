import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';
import { MoradorService } from './morador.service';
import { CurrentUserDto } from 'src/core/auth/current-user.dto';
import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { Rotas } from 'src/enums/rotas.enum';

@UseGuards(JwtAuthGuard)
@ApiTags(Rotas.moradores)
@Controller(Rotas.moradores)
export class MoradorController {
  constructor(private readonly moradorService: MoradorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo morador' })
  @ApiBody({ type: CreateMoradorDto })
  @ApiResponse({ status: 201, description: 'Morador criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body() createMoradorDto: CreateMoradorDto,
    @CurrentUser() { id, matricula, nome }: CurrentUserDto,
  ) {
    return await this.moradorService.create(createMoradorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os moradores' })
  @ApiResponse({ status: 200, description: 'Lista de moradores' })
  async findAll() {
    return await this.moradorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar morador por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do morador' })
  @ApiResponse({ status: 200, description: 'Morador encontrado' })
  @ApiResponse({ status: 404, description: 'Morador não encontrado' })
  async findOne(@Param('id') id: string) {
    return await this.moradorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar morador' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do morador' })
  @ApiBody({ type: UpdateMoradorDto })
  @ApiResponse({ status: 200, description: 'Morador atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Morador não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateMoradorDto: UpdateMoradorDto,
  ) {
    return await this.moradorService.update(+id, updateMoradorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover morador' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do morador' })
  @ApiResponse({ status: 200, description: 'Morador removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Morador não encontrado' })
  async remove(@Param('id') id: string) {
    return await this.moradorService.remove(+id);
  }
}
