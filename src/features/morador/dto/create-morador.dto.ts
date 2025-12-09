import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCarroDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo (única)' })
  placa: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Gol', description: 'Modelo do veículo' })
  modelo?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Prata', description: 'Cor do veículo' })
  cor?: string;
}

export class CreateMoradorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'João Silva', description: 'Nome do morador' })
  nome: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'B', description: 'Bloco do apartamento' })
  bloco?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '203', description: 'Número do apartamento' })
  apartamento: string;

  @Type(() => CreateCarroDto)
  @ValidateNested()
  @ApiPropertyOptional({
    type: CreateCarroDto,
    description: 'Dados do carro (opcional)',
  })
  carro?: CreateCarroDto;
}
