import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Lê Khải Hoàn | Server Twitter on ${process.env.PORT}`;
  }
}
