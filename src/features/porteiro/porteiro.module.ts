import { Module } from '@nestjs/common';
import { PorteiroController } from './porteiro.controller';
import { PorteiroService } from './porteiro.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [PorteiroController],
  providers: [PorteiroService, PrismaService],
})
export class PorteiroModule {}
