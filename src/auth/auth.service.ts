import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthLogin, AuthResgiter } from './dto';
import { generateFromEmail } from 'unique-username-generator';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async resgiter(body: AuthResgiter, res: Response) {
    const { email, fullname, username, password } = body;
    const emailExists = await this.userService.findByEmail(email);
    if (emailExists) {
      throw new HttpException('E-mail is being used!', HttpStatus.FORBIDDEN);
    }
    const userExists = await this.userService.findByUsername(username);
    if (userExists) {
      throw new HttpException(
        'This username is already used!',
        HttpStatus.FORBIDDEN,
      );
    }
    const newUserName = !username
      ? generateFromEmail(email, 3)
      : username.replace(/ /g, '');
    const passwordHash = await this.hashData(password, 12);

    const newUser = await this.userService.create({
      fullname,
      email,
      username: newUserName,
      password: passwordHash,
    });

    const access_token = await this.getAccessToken({ id: newUser._id });
    const refresh_token = await this.getRefreshToken({ id: newUser._id });

    await this.updateRefreshToken(newUser._id, refresh_token);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/auth/refreshToken',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    res.json({ access_token });
  }

  async login(body: AuthLogin, res: Response) {
    const { email, password } = body;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    const access_token = await this.getAccessToken({ id: user._id });
    const refresh_token = await this.getRefreshToken({ id: user._id });

    await this.updateRefreshToken(user._id, refresh_token);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/auth/refreshToken',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    res.json({
      access_token,
    });
  }

  async checkEmail(body: { email: string }) {
    const { email } = body;
    const user = await this.userService.findByEmail(email);
    return {
      checkemail: user ? true : false,
    };
  }

  async generateAccessToken(req: Request, res: Response) {
    try {
      const rf_token = req.cookies.refresh_token;
      if (!rf_token)
        return res.status(400).json({ message: 'Please Login now!' });

      const { id } = this.jwtService.verify(rf_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.findById(id);
      if (!user) {
        return res.status(400).json({ message: 'Login now!' });
      }
      const accessToken = await this.getAccessToken({ id: user._id });
      res.status(200).json({
        accessToken,
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  hashData(data: string, key: number) {
    return bcrypt.hash(data, key);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken, 12);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getAccessToken(payload: { id: string }) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
  }
  async getRefreshToken(payload: { id: string }) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }
}
