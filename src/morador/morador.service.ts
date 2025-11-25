import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';

@Injectable()
export class MoradorService {
  constructor(private readonly prismaService: PrismaService) {}

  private normalizePlaca(placa?: string): string | undefined {
    const p = placa ? placa.trim().toUpperCase() : undefined;
    return p && p.length > 0 ? p : undefined;
  }

  async create(createMoradorDto: CreateMoradorDto) {
    const { nome, bloco, apartamento, carro, ...rest } = createMoradorDto;

    if (Object.keys(createMoradorDto).includes('carro') && carro) {
      const placa = this.normalizePlaca(carro.placa);

      return await this.prismaService.morador.create({
        data: {
          nome,
          bloco,
          apartamento,
          carro: {
            create: {
              ...carro,
              placa: placa!,
            },
          },
          ...rest,
        },
        include: {
          carro: true,
        },
      });
    }

    return await this.prismaService.morador.create({
      data: {
        nome,
        bloco,
        apartamento,
        ...rest,
      },
      include: {
        carro: true,
      },
    });
  }

  async findAll() {
    return await this.prismaService.morador.findMany({
      include: {
        carro: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.morador.findUnique({
      include: { carro: true },
      where: { id },
    });
  }

  async update(id: number, updateMoradorDto: UpdateMoradorDto) {
    const moradorExistente = await this.prismaService.morador.findUnique({
      where: { id },
      include: { carro: true },
    });

    if (!moradorExistente) {
      throw new NotFoundException(`Morador com ID ${id} não encontrado`);
    }

    const { carro, ...dadosMorador } = updateMoradorDto;

    if (!carro) {
      return await this.prismaService.morador.update({
        where: { id },
        data: dadosMorador,
        include: { carro: true },
      });
    }

    // Processar dados do carro
    const placaNormalizada = this.normalizePlaca(carro.placa);

    if (!placaNormalizada) {
      throw new BadRequestException('Placa não pode ser vazia');
    }

    // Verificar se a placa já existe em outro carro
    const carroComPlaca = await this.prismaService.carro.findUnique({
      where: { placa: placaNormalizada },
    });

    // Se encontrou um carro com a placa e ele pertence ao morador atual
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (carroComPlaca && carroComPlaca.moradorId === id) {
      // Atualizar o carro existente do morador
      return await this.prismaService.morador.update({
        where: { id },
        data: {
          ...dadosMorador,
          carro: {
            update: {
              where: { id: carroComPlaca.id },
              data: {
                placa: placaNormalizada,
                modelo: carro.modelo,
                cor: carro.cor,
              },
            },
          },
        },
        include: { carro: true },
      });
    }

    // Se encontrou um carro com a placa mas pertence a outro morador/visitante
    if (carroComPlaca && carroComPlaca.moradorId !== id) {
      throw new BadRequestException(
        `Placa ${placaNormalizada} já está cadastrada para outro proprietário`,
      );
    }

    // Placa não existe: criar novo carro para o morador
    return await this.prismaService.morador.update({
      where: { id },
      data: {
        ...dadosMorador,
        carro: {
          create: {
            placa: placaNormalizada,
            modelo: carro.modelo,
            cor: carro.cor,
          },
        },
      },
      include: { carro: true },
    });
  }

  async remove(id: number) {
    return await this.prismaService.morador.delete({
      where: { id },
    });
  }
}
