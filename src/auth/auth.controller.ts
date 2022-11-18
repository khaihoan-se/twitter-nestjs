import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthResgiter } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}
  @Post('register')
  register(@Body() body: AuthResgiter, @Res() res: Response) {
    this.authSevice.resgiter(body, res);
  }
}
