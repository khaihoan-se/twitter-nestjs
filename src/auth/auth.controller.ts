import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthLogin, AuthResgiter } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}
  @Post('register')
  register(@Body() body: AuthResgiter, @Res() res: Response) {
    return this.authSevice.resgiter(body, res);
  }
  @Post('login')
  login(@Body() body: AuthLogin, @Res() res: Response) {
    return this.authSevice.login(body, res);
  }
  @Post('check_email')
  checkEmail(@Body() body: { email: string }) {
    return this.authSevice.checkEmail(body);
  }
  @Post('refreshToken')
  generateAccessToken(@Req() req: Request, @Res() res: Response) {
    this.authSevice.generateAccessToken(req, res);
  }
}
