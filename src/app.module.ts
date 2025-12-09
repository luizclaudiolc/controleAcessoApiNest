import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';
import { MoradorModule } from './features/morador/morador.module';
import { VisitanteModule } from './features/visitante/visitante.module';
import { PorteiroModule } from './features/porteiro/porteiro.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MoradorModule,
    VisitanteModule,
    PorteiroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
