import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, ICreateUser } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  createUser(@Body() body: ICreateUser) {
    const { nome, matricula, senha, roles } = body;
    return this.authService.createUser({ nome, matricula, senha, roles });
  }

  @Post('login')
  loginUser(@Body() body: Omit<ICreateUser, 'nome' | 'roles'>) {
    const { matricula, senha } = body;
    return this.authService.loginUser({ matricula, senha });
  }
}
