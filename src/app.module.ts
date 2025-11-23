import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoradorModule } from './morador/morador.module';

@Module({
  imports: [PrismaModule, MoradorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
