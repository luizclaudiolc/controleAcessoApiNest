import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, ICreateUser } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  createUser(@Body() body: ICreateUser) {
    const { nome, matricula, senha } = body;
    return this.authService.createUser({ nome, matricula, senha });
  }

  @Post('login')
  loginUser(@Body() body: Omit<ICreateUser, 'nome'>) {
    const { matricula, senha } = body;
    return this.authService.loginUser({ matricula, senha });
  }
}
