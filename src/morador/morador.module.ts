import { Module } from '@nestjs/common';
import { MoradorService } from './morador.service';
import { MoradorController } from './morador.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MoradorController],
  providers: [MoradorService, PrismaService],
})
export class MoradorModule {}
