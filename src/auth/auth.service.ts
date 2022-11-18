import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthResgiter } from './dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async resgiter(body: AuthResgiter, res: Response) {
    const { email, fullname, username, password } = body;
    console.log(body);

    return 'Hello Resgiter';
  }
}

export default AuthService;
