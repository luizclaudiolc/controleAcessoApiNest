import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreatePorteiroDto } from './dto/create-porteiro.dto';
import { UpdatePorteiroDto } from './dto/update-porteiro.dto';

import { _hash, _salt } from 'src/core/encriptKey/encriptPassword';
import { formatDate } from 'src/shared/helpers';

@Injectable()
export class PorteiroService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeMatricula(matricula: string): string {
    const mat = matricula ? matricula.trim().toUpperCase() : '';
    return mat && mat.length > 0 ? mat : '';
  }

  async getTodosPorteiros() {
    return await this.prisma.porteiro.findMany({
      where: { deleteAt: null },
      select: {
        id: true,
        nome: true,
        matricula: true,
      },
    });
  }

  async getPorteiroById(id: number) {
    const porteiro = await this.prisma.porteiro.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        matricula: true,
        deleteAt: true,
      },
    });

    if (!porteiro) {
      throw new BadRequestException({
        success: false,
        message: `Porteiro com ID '${id}' não encontrado.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    if (porteiro.deleteAt) {
      throw new BadRequestException({
        success: false,
        message: `Porteiro com matrícula '${porteiro.matricula}' foi excluído na data '${formatDate(porteiro.deleteAt)}'.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    porteiro.deleteAt = null;

    return porteiro;
  }

  async createPorteiro(porteiro: CreatePorteiroDto) {
    const matricula = this.normalizeMatricula(porteiro.matricula);

    const existingPorteiro = await this.prisma.porteiro.findFirst({
      where: { matricula },
    });

    if (existingPorteiro) {
      throw new BadRequestException({
        success: false,
        message: `Matrícula '${matricula}' já está em uso por outro porteiro.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    const salt = _salt;
    const hash = await _hash(porteiro.senha, salt);
    porteiro.senha = `${salt}.${hash.toString('hex')}`;

    return await this.prisma.porteiro.create({
      data: {
        ...porteiro,
        matricula,
      },
    });
  }

  async updatePorteiro(id: number, porteiro: UpdatePorteiroDto) {
    const matricula = this.normalizeMatricula(porteiro.matricula!);

    const existingPorteiro = await this.prisma.porteiro.findFirst({
      where: {
        matricula,
        NOT: { id },
        deleteAt: null,
      },
    });

    if (existingPorteiro) {
      throw new BadRequestException({
        success: false,
        message: `Matrícula '${matricula}' já está em uso por outro porteiro.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    return await this.prisma.porteiro.update({
      where: { id },
      data: {
        ...porteiro,
        matricula,
      },
    });
  }

  async deletePorteiro(id: number) {
    const porteiro = await this.prisma.porteiro.findUnique({
      where: { id },
    });

    if (!porteiro) {
      throw new BadRequestException({
        success: false,
        message: `Porteiro com ID '${id}' não encontrado.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    if (porteiro.deleteAt) {
      throw new BadRequestException({
        success: false,
        message: `Porteiro com matrícula '${porteiro.matricula}' já foi excluído na data '${formatDate(porteiro.deleteAt)}'.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    return await this.prisma.porteiro.update({
      where: { id },
      data: { deleteAt: new Date() },
    });
  }
}
