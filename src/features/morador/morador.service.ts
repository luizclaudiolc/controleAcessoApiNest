import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMoradorDto } from './dto/create-morador.dto';
import { UpdateMoradorDto } from './dto/update-morador.dto';
import { Carro, Morador } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

export interface MoradorComCarro extends Morador {
  carro: Carro[];
}

export interface MoradorComCarroETotal extends MoradorComCarro {
  totalMoradoresCadastrados: number;
}
@Injectable()
export class MoradorService {
  constructor(private readonly prismaService: PrismaService) {}

  private normalizePlaca(placa?: string): string | undefined {
    const p = placa ? placa.trim().toUpperCase() : undefined;
    return p && p.length > 0 ? p : undefined;
  }

  async create(createMoradorDto: CreateMoradorDto): Promise<MoradorComCarro> {
    const { nome, bloco, apartamento, carro, ...rest } = createMoradorDto;

    const placa = this.normalizePlaca(carro?.placa);

    if (placa) {
      const carroExistente = await this.prismaService.carro.findUnique({
        where: { placa },
      });

      if (carroExistente) {
        throw new BadRequestException({
          success: false,
          message: `Já existe um carro cadastrado com a placa ${placa}`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (carro) {
      const result = await this.prismaService.$transaction(async (tx) => {
        const morador = await tx.morador.create({
          data: {
            nome,
            bloco,
            apartamento,
            ...rest,
          },
        });

        const novoCarro = await tx.carro.create({
          data: {
            ...carro,
            placa: placa!,
            donoId: morador.id,
            donoTipo: 'MORADOR',
          },
        });

        return { ...morador, carro: [novoCarro] };
      });

      return result;
    }

    const morador = await this.prismaService.morador.create({
      data: { nome, bloco, apartamento, ...rest },
    });
    return { ...morador, carro: [] };
  }

  async findAll(): Promise<MoradorComCarroETotal[]> {
    const moradores = await this.prismaService.morador.findMany();
    const ids = moradores.map((m) => m.id);
    const carros = await this.prismaService.carro.findMany({
      where: {
        donoId: { in: ids },
        donoTipo: 'MORADOR',
      },
    });

    const mapa = new Map<number, any[]>();
    carros.forEach((c) => {
      const ownerId = c.donoId;
      if (ownerId === null) return;
      if (!mapa.has(ownerId)) mapa.set(ownerId, []);
      mapa.get(ownerId)!.push(c);
    });

    return moradores.map((m) => ({
      ...m,
      carro: mapa.get(m.id) ?? [],
      totalMoradoresCadastrados: moradores.length,
    }));
  }

  async findOne(id: number): Promise<MoradorComCarro> {
    const morador = await this.prismaService.morador.findUnique({
      where: { id },
    });

    if (!morador) {
      throw new NotFoundException({
        success: false,
        message: `Morador com ID ${id} não encontrado`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    const carros = await this.prismaService.carro.findMany({
      where: { donoId: id, donoTipo: 'MORADOR' },
    });

    return { ...morador, carro: carros };
  }

  async update(
    id: number,
    updateMoradorDto: UpdateMoradorDto,
  ): Promise<MoradorComCarro> {
    const { nome, bloco, apartamento, carro, ...rest } = updateMoradorDto;

    const placa = this.normalizePlaca(carro?.placa);

    if (carro && placa) {
      const carrosDoMorador = await this.prismaService.carro.findMany({
        where: { donoId: id, donoTipo: 'MORADOR' },
      });

      const carroExistente = carrosDoMorador.find((c) => c.placa === placa);

      if (carroExistente) {
        // Atualiza carro e morador existente
        const result = await this.prismaService.$transaction(async (tx) => {
          const morador = await tx.morador.update({
            where: { id },
            data: {
              nome,
              bloco,
              apartamento,
              ...rest,
            },
          });

          const updatedCarro = await tx.carro.update({
            where: { id: carroExistente.id },
            data: {
              ...carro,
              placa,
              donoId: morador.id,
              donoTipo: 'MORADOR',
            },
          });

          return { ...morador, carro: [updatedCarro] };
        });

        return result;
      }

      const carroPertenceAoutroDono = await this.prismaService.carro.findUnique(
        {
          where: { placa },
        },
      );

      if (carroPertenceAoutroDono) {
        throw new BadRequestException({
          success: false,
          message: `Já existe um carro cadastrado com a placa ${placa} para outro dono.`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }

      // Cria novo carro para o morador
      const result = await this.prismaService.$transaction(async (tx) => {
        const morador = await tx.morador.update({
          where: { id },
          data: {
            nome,
            bloco,
            apartamento,
            ...rest,
          },
        });

        const novoCarro = await tx.carro.create({
          data: {
            ...carro,
            placa,
            donoId: morador.id,
            donoTipo: 'MORADOR',
          },
        });

        return { ...morador, carro: [novoCarro] };
      });

      return result;
    }

    const morador = await this.prismaService.morador.update({
      where: { id },
      data: { nome, bloco, apartamento, ...rest },
    });

    const carros = await this.prismaService.carro.findMany({
      where: { donoId: id, donoTipo: 'MORADOR' },
    });

    return { ...morador, carro: carros };
  }

  async remove(id: number): Promise<void> {
    return await this.prismaService.$transaction(async (tx) => {
      await tx.carro.deleteMany({
        where: { donoId: id, donoTipo: 'MORADOR' },
      });

      await tx.morador.delete({
        where: { id },
      });
    });
  }
}
