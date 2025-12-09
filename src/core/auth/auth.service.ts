import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { _hash, _salt } from '../encriptKey/encriptPassword';
import { PrismaService } from '../prisma/prisma.service';

export interface IJwtPayload {
  username: string;
  sub: {
    id: number;
    matricula: string;
  };
}

export interface ICreateUser {
  nome: string;
  matricula: string;
  senha: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private normalizaMatricula(matricula: string): string {
    return matricula.trim().toUpperCase();
  }

  async createUser({ nome, matricula, senha }: ICreateUser) {
    matricula = this.normalizaMatricula(matricula);
    const porteiroExiste = await this.prisma.porteiro.findUnique({
      where: { matricula },
    });

    if (porteiroExiste) {
      throw new BadRequestException({
        success: false,
        message: `Já existe um usuário cadastrado com a matrícula: ${matricula}.`,
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    const salt = _salt;
    const hash = await _hash(senha, salt);
    const hashedsenha = `${salt}.${hash.toString('hex')}`;
    const user = { matricula, senha: hashedsenha };

    const novoPorteiro = await this.prisma.porteiro.create({
      data: {
        nome,
        matricula: user.matricula,
        senha: user.senha,
      },
    });

    return { ...novoPorteiro, senha: undefined };
  }

  async loginUser({ matricula, senha }: Omit<ICreateUser, 'nome'>) {
    matricula = this.normalizaMatricula(matricula);
    const user = await this.prisma.porteiro.findUnique({
      where: { matricula },
    });

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Credenciais inválidas.',
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    const [salt, storedHash] = user.senha.split('.');
    const hash = await _hash(senha, salt);

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException({
        success: false,
        message: 'Credenciais inválidas.',
        errors: null,
        timestamp: new Date().toISOString(),
      });
    }

    const { senha: _, ...rest } = user;
    const payload = {
      username: user.nome,
      sub: {
        id: user.id,
        matricula: user.matricula,
      },
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
