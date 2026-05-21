import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCarroDto } from 'src/features/morador/dto/create-morador.dto';

export enum TipoRegistroDto {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

export class CreateRegistroDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'ABC1D23',
    description: 'Placa do carro (caso não tenha carro cadastrado)',
  })
  placa?: string;
}

export class CreateVisitanteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do visitante é obrigatório.' })
  @ApiProperty({ example: 'Maria Oliveira', description: 'Nome do visitante' })
  nome: string = '';

  @IsString()
  @IsNotEmpty({ message: 'O documento do visitante é obrigatório.' })
  @ApiProperty({
    example: '123.456.789-00',
    description: 'Documento do visitante',
  })
  documento: string = '';

  @IsString()
  @IsPhoneNumber('BR', {
    message: 'O telefone deve ser um número de celular válido.',
  })
  @IsOptional()
  @ApiPropertyOptional({
    example: '(11) 91234-5678',
    description: 'Telefone do visitante',
  })
  telefone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Visitante para reunião',
    description: 'Descrição do motivo da visita',
  })
  descricao?: string;

  @IsOptional()
  @Type(() => CreateCarroDto)
  @ValidateNested()
  @ApiPropertyOptional({
    type: CreateCarroDto,
    description: 'Dados do carro do visitante (opcional)',
  })
  carro?: CreateCarroDto;

  @ValidateNested()
  @Type(() => CreateRegistroDto)
  @ApiProperty({
    type: CreateRegistroDto,
    description: 'Informações adicionais do registro de entrada',
  })
  registro: CreateRegistroDto = new CreateRegistroDto();
}
