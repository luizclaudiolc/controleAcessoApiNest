import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePorteiroDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Carlos Souza', description: 'Nome do porteiro' })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'M123456', description: 'Matrícula do porteiro' })
  matricula: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do porteiro' })
  senha: string;

  @ApiProperty({ example: ['PORTEIRO'], description: 'Roles do porteiro' })
  @IsNotEmpty()
  roles: Roles[];
}
