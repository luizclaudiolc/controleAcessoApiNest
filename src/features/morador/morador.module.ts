import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MoradorController } from './morador.controller';
import { MoradorService } from './morador.service';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MoradorController],
  providers: [MoradorService, PrismaService],
})
export class MoradorModule {}
