import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Erro na operação com o banco de dados';
    let errors = null;

    // 🔥 Erros específicos do Prisma (mais usados)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          // Unique constraint
          status = HttpStatus.CONFLICT;
          message = `Já existe um registro com esse(s) valor(es) único(s): ${exception.meta?.target}`;
          break;

        case 'P2025':
          // Registro não encontrado
          status = HttpStatus.NOT_FOUND;
          message = 'Registro não encontrado';
          break;

        case 'P2003':
          // FK inválida
          status = HttpStatus.BAD_REQUEST;
          message = `Violação de chave estrangeira: ${exception.meta?.field_name}`;
          break;

        default:
          message = `Erro do banco (código ${exception.code})`;
          break;
      }
    }

    // 🔥 Erros de validação do Prisma (tipo errado, campo faltando etc.)
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Dados inválidos enviados para o banco';
      errors = exception.message.split('\n').at(-1) as any;
    }

    // 🔥 Erros de inicialização
    else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Falha ao iniciar conexão com o banco de dados';
    }

    // Resposta padronizada
    return response.status(status).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
