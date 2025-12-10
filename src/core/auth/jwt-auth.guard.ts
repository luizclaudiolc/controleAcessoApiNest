import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from './roles.decorator';
import { Roles } from '@prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<'roles'>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string } }>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token de autenticação ausente');
    }

    const payload: { sub: { roles: Roles[] } } = this.jwtService.verify(token);
    const userRoles: Roles[] = payload.sub.roles || [];

    const hasRole = (() =>
      userRoles.some((role: string) => requiredRoles.includes(role)))();

    if (!hasRole) {
      throw new UnauthorizedException(
        'Usuário não possui permissão para acessar este recurso',
      );
    }

    return true;
  }
}
