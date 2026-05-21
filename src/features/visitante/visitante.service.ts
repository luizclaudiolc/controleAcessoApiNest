import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Carro, Visitante } from '@prisma/client';
import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { UpdateVisitanteDto } from './dto/update-visitante.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class VisitanteService {
  constructor(private readonly prismaService: PrismaService) {}

  private normalizePlaca(placa?: string): string | undefined {
    const p = placa ? placa.trim().toUpperCase() : undefined;
    return p && p.length > 0 ? p : undefined;
  }

  async create(createVisitanteDto: CreateVisitanteDto, porteiroId: string) {
    const { nome, documento, carro, registro, ...rest } = createVisitanteDto;
    const placaCarro = this.normalizePlaca(carro?.placa);
    const placaRegistro = this.normalizePlaca(registro?.placa);

    return await this.prismaService.$transaction(async (tx) => {
      let visitante: Visitante | null = null;
      let carroParaUsar: Carro | null = null;

      if (documento && nome) {
        visitante = await tx.visitante.findUnique({
          where: { documento, nome },
        });
      }

      if (!visitante) {
        visitante = await tx.visitante.create({
          data: {
            nome,
            documento,
            telefone: rest.telefone,
            descricao: rest.descricao,
            criadoPorId: porteiroId,
          },
        });
      }

      const registroAberto = await tx.registro.findFirst({
        where: {
          visitanteId: visitante.id,
          dataHoraSaida: null,
        },
      });

      if (registroAberto) {
        throw new BadRequestException({
          success: false,
          message: `O visitante ${visitante.nome} já possui um registro de entrada em aberto.`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }

      if (carro && placaCarro) {
        const carroExistente = await tx.carro.findUnique({
          where: { placa: placaCarro },
        });

        if (carroExistente) {
          if (carroExistente.donoTipo === 'MORADOR') {
            throw new BadRequestException({
              success: false,
              message: `A placa ${placaCarro} está cadastrada para um morador e não pode ser usada por visitantes`,
              errors: null,
              timestamp: new Date().toISOString(),
            });
          }

          carroParaUsar = await tx.carro.update({
            where: { placa: placaCarro },
            data: {
              donoId: visitante.id,
              modelo: carro.modelo || carroExistente.modelo,
              cor: carro.cor || carroExistente.cor,
            },
          });
        } else {
          carroParaUsar = await tx.carro.create({
            data: {
              placa: placaCarro,
              modelo: carro.modelo,
              cor: carro.cor,
              donoId: visitante.id,
              donoTipo: 'VISITANTE',
            },
          });
        }
      }

      const novoRegistro = await tx.registro.create({
        data: {
          tipo: 'ENTRADA',
          carroId: carroParaUsar?.id,
          placa: carroParaUsar ? null : placaRegistro,
          visitanteId: visitante.id,
          dataHoraEntrada: new Date(),
          dataHoraSaida: null,
          porteiroId,
        },
      });

      const todosRegistros = await tx.registro.findMany({
        where: { visitanteId: visitante.id },
        orderBy: { dataHoraEntrada: 'desc' },
        include: {
          carro: true,
          porteiro: {
            select: {
              id: true,
              nome: true,
              matricula: true,
            },
          },
        },
      });

      const todosCarros = await tx.carro.findMany({
        where: {
          donoId: visitante.id,
          donoTipo: 'VISITANTE',
          deleteAt: null,
        },
      });

      return {
        message: visitante
          ? 'Entrada registrada com sucesso'
          : 'Visitante e entrada registrados com sucesso',
        data: {
          ...visitante,
          carros: todosCarros,
        },
      };
    });
  }

  async registrarSaida(visitanteId: string, porteiroId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const visitante = await tx.visitante.findUnique({
        where: { id: visitanteId },
      });

      if (!visitante) {
        throw new NotFoundException({
          success: false,
          message: `Visitante com ID ${visitanteId} não encontrado`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }

      const registroAberto = await tx.registro.findFirst({
        where: {
          visitanteId,
          dataHoraSaida: null,
        },
        orderBy: {
          dataHoraEntrada: 'desc',
        },
      });

      if (!registroAberto) {
        throw new BadRequestException({
          success: false,
          message: `Não há registro de ENTRADA em aberto para o visitante ${visitante.nome}`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }

      const registroAtualizado = await tx.registro.update({
        where: { id: registroAberto.id },
        data: {
          tipo: 'SAIDA',
          dataHoraSaida: new Date(),
          porteiroId: porteiroId || registroAberto.porteiroId,
        },
      });

      const tempoMs =
        registroAtualizado.dataHoraSaida!.getTime() -
        registroAberto.dataHoraEntrada.getTime();
      const tempoMinutos = Math.floor(tempoMs / 60000);

      const todosRegistros = await tx.registro.findMany({
        where: { visitanteId },
        orderBy: { dataHoraEntrada: 'desc' },
        include: {
          carro: true,
          porteiro: {
            select: {
              id: true,
              nome: true,
              matricula: true,
            },
          },
        },
      });

      return {
        ...visitante,
        registroAtual: registroAtualizado,
        tempoPermanencia: {
          minutos: tempoMinutos,
          horas: Math.floor(tempoMinutos / 60),
          formatado: `${Math.floor(tempoMinutos / 60)}h ${tempoMinutos % 60}m`,
        },
        historicoRegistros: todosRegistros,
        totalVisitas: todosRegistros.filter(
          ({ dataHoraSaida }) => dataHoraSaida !== null,
        ).length,
      };
    });
  }

  async findAll() {
    const visitantes = await this.prismaService.visitante.findMany({
      where: { deleteAt: null },
      include: {
        registros: {
          orderBy: { dataHoraEntrada: 'desc' },
          include: {
            carro: true,
            porteiro: {
              select: {
                id: true,
                nome: true,
                matricula: true,
              },
            },
          },
        },
      },
    });

    const ids = visitantes.map(({ id }) => id);

    const carros = await this.prismaService.carro.findMany({
      where: {
        donoId: { in: ids },
        donoTipo: 'VISITANTE',
        deleteAt: null,
      },
    });

    return visitantes.map((v) => ({
      ...v,
      carros: carros.filter(({ donoId }) => donoId === v.id),
      registroAberto: v.registros.find((r) => r.dataHoraSaida === null),
      totalVisitas: v.registros.filter((r) => r.dataHoraSaida !== null).length,
      dentroDoCondominio: v.registros.some((r) => r.dataHoraSaida === null),
    }));
  }

  async findVisitantesEmAberto() {
    const visitantes = await this.prismaService.visitante.findMany({
      where: {
        deleteAt: null,
        registros: {
          some: {
            dataHoraSaida: null,
          },
        },
      },
      include: {
        registros: {
          where: {
            dataHoraSaida: null,
          },
          include: {
            carro: true,
            porteiro: {
              select: {
                id: true,
                nome: true,
                matricula: true,
              },
            },
          },
        },
      },
    });

    const carros = await this.prismaService.carro.findMany({
      where: {
        donoId: { in: visitantes.map(({ id }) => id) },
        donoTipo: 'VISITANTE',
        deleteAt: null,
      },
    });

    const visitantesFormatados = visitantes.map((v) => {
      const registroAberto = v.registros[0];

      return {
        id: v.id,
        nome: v.nome,
        documento: v.documento,
        telefone: v.telefone,
        descricao: v.descricao,
        carros: carros.filter(({ donoId }) => donoId === v.id),
        registroAberto: {
          id: registroAberto.id,
          dataHoraEntrada: registroAberto.dataHoraEntrada,
          tipo: registroAberto.tipo,
          placa: registroAberto.placa,
          carro: registroAberto.carro,
          porteiro: registroAberto.porteiro,
        },
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      };
    });

    return {
      message: `${visitantesFormatados.length} visitante(s) dentro do condomínio`,
      data: visitantesFormatados,
    };
  }

  async findOne(id: string) {
    const visitante = await this.prismaService.visitante.findUnique({
      where: { id },
      include: {
        registros: {
          where: {
            dataHoraSaida: null,
          },
          orderBy: { dataHoraEntrada: 'desc' },
          take: 1,
          include: {
            carro: true,
            porteiro: {
              select: {
                id: true,
                nome: true,
                matricula: true,
              },
            },
          },
        },
      },
    });

    if (!visitante) {
      throw new NotFoundException({
        success: false,
        message: `Visitante com ID ${id} não encontrado`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    const carros = await this.prismaService.carro.findMany({
      where: {
        donoId: id,
        donoTipo: 'VISITANTE',
        deleteAt: null,
      },
    });

    const totalVisitas = await this.prismaService.registro.count({
      where: {
        visitanteId: id,
        dataHoraSaida: { not: null },
      },
    });

    const registroAberto = visitante.registros[0] || null;
    const ultimaAtualizacaoPor = await this.prismaService.porteiro.findFirst({
      where: {
        registros: {
          some: {
            visitanteId: id,
          },
        },
      },
      select: {
        id: true,
        nome: true,
        matricula: true,
      },
    });

    return {
      id: visitante.id,
      nome: visitante.nome,
      documento: visitante.documento,
      telefone: visitante.telefone,
      descricao: visitante.descricao,
      carros,
      registroAberto: registroAberto
        ? {
            id: registroAberto.id,
            dataHoraEntrada: registroAberto.dataHoraEntrada,
            tipo: registroAberto.tipo,
            placa: registroAberto.placa,
            carro: registroAberto.carro,
            porteiro: registroAberto.porteiro,
          }
        : null,
      ultimaAtualizacaoPor,
      totalVisitas,
      dentroDoCondominio: registroAberto !== null,
      createdAt: visitante.createdAt,
      updatedAt: visitante.updatedAt,
    };
  }

  async update(
    id: string,
    updateVisitanteDto: UpdateVisitanteDto,
    porteiroId: string,
  ) {
    const { nome, documento, telefone, descricao, carro } = updateVisitanteDto;
    const placa = this.normalizePlaca(carro?.placa);

    return await this.prismaService.$transaction(async (tx) => {
      const visitanteExistente = await tx.visitante.findUnique({
        where: { id },
      });

      if (!visitanteExistente) {
        throw new NotFoundException({
          success: false,
          message: `Visitante com ID ${id} não encontrado`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }

      // Valida se o porteiro existe
      const porteiroExistente = await tx.porteiro.findUnique({
        where: { id: porteiroId },
      });

      if (!porteiroExistente) {
        throw new NotFoundException({
          success: false,
          message: `Porteiro com ID ${porteiroId} não encontrado`,
          errors: null,
          timestamp: new Date().toISOString(),
        });
      }

      if (documento && documento !== visitanteExistente.documento) {
        const documentoDuplicado = await tx.visitante.findUnique({
          where: { documento },
        });

        if (documentoDuplicado && documentoDuplicado.id !== id) {
          throw new BadRequestException({
            success: false,
            message: `O documento ${documento} já está cadastrado para outro visitante (ID: ${documentoDuplicado.id})`,
            errors: null,
            timestamp: new Date().toISOString(),
          });
        }
      }

      const visitanteAtualizado = await tx.visitante.update({
        where: { id },
        data: {
          nome: nome || visitanteExistente.nome,
          documento: documento || visitanteExistente.documento,
          telefone:
            telefone !== undefined ? telefone : visitanteExistente.telefone,
          descricao:
            descricao !== undefined ? descricao : visitanteExistente.descricao,
          porteiroId: porteiroId,
          atualizadoPorId: porteiroId,
        },
      });

      if (carro && placa) {
        const carroExistente = await tx.carro.findUnique({
          where: { placa },
        });

        if (carroExistente) {
          if (carroExistente.donoTipo === 'MORADOR') {
            throw new BadRequestException({
              success: false,
              message: `A placa ${placa} já está cadastrada para um morador`,
              errors: null,
              timestamp: new Date().toISOString(),
            });
          }

          if (
            carroExistente.donoTipo === 'VISITANTE' &&
            carroExistente.donoId === id
          ) {
            await tx.carro.update({
              where: { placa },
              data: {
                modelo: carro.modelo || carroExistente.modelo,
                cor: carro.cor || carroExistente.cor,
              },
            });
          } else if (carroExistente.donoTipo === 'VISITANTE') {
            await tx.carro.update({
              where: { placa },
              data: {
                donoId: id,
                modelo: carro.modelo || carroExistente.modelo,
                cor: carro.cor || carroExistente.cor,
              },
            });
          }
        } else {
          await tx.carro.create({
            data: {
              placa,
              modelo: carro.modelo,
              cor: carro.cor,
              donoId: id,
              donoTipo: 'VISITANTE',
            },
          });
        }
      }

      const todosCarros = await tx.carro.findMany({
        where: {
          donoId: id,
          donoTipo: 'VISITANTE',
          deleteAt: null,
        },
      });

      return {
        message: 'Visitante atualizado com sucesso',
        data: {
          ...visitanteAtualizado,
          carros: todosCarros,
          ultimaAtualizacaoPor: {
            nome: porteiroExistente.nome,
            matricula: porteiroExistente.matricula,
          },
        },
      };
    });
  }

  async remove(id: string) {
    const visitante = await this.prismaService.visitante.findUnique({
      where: { deleteAt: null, id },
    });

    if (!visitante) {
      throw new NotFoundException({
        success: false,
        message: `Visitante com ID ${id} não encontrado`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    return this.prismaService.visitante.update({
      where: { id },
      data: { deleteAt: new Date() },
    });
  }
}
