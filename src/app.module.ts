import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoradorModule } from './morador/morador.module';
import { VisitanteModule } from './visitante/visitante.module';

@Module({
  imports: [PrismaModule, MoradorModule, VisitanteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
