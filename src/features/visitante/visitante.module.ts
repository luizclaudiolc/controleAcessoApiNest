import { Module } from '@nestjs/common';
import { VisitanteService } from './visitante.service';
import { VisitanteController } from './visitante.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VisitanteController],
  providers: [VisitanteService, PrismaService],
})
export class VisitanteModule {}
