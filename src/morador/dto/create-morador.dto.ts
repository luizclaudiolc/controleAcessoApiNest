import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarroDto {
  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo (única)' })
  placa: string;

  @ApiPropertyOptional({ example: 'Gol', description: 'Modelo do veículo' })
  modelo?: string;

  @ApiPropertyOptional({ example: 'Prata', description: 'Cor do veículo' })
  cor?: string;
}

export class CreateMoradorDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do morador' })
  nome: string;

  @ApiPropertyOptional({ example: 'B', description: 'Bloco do apartamento' })
  bloco?: string;

  @ApiProperty({ example: '203', description: 'Número do apartamento' })
  apartamento: string;

  @ApiPropertyOptional({
    type: CreateCarroDto,
    description: 'Dados do carro (opcional)',
  })
  carro?: CreateCarroDto;
}
