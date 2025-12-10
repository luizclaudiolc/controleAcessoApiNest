import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

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
  @ApiProperty({ example: 'SenhaSegura123', description: 'Senha do porteiro' })
  senha: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  @IsNotEmpty()
  @ApiProperty({ example: ['PORTEIRO'], description: 'Roles do porteiro' })
  roles: Roles[];
}
