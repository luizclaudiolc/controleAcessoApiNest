import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreateCarroDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:[A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9][A-Z0-9][0-9]{2})$/, {
    message:
      'A placa deve seguir o formato ABC1D23 (Mercosul) ou ASD0102 (modelo antigo), com letras maiúsculas e números',
  })
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
