import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';

@Injectable()
export class MoradorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMoradorDto: CreateMoradorDto) {
    const morador = await this.prismaService.morador.create({
      data: createMoradorDto,
    });

    return morador;
  }

  async findAll() {
    return await this.prismaService.morador.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.morador.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMoradorDto: UpdateMoradorDto) {
    return await this.prismaService.morador.update({
      where: { id },
      data: updateMoradorDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.morador.delete({
      where: { id },
    });
  }
}
