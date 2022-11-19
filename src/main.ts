import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  // Auto Validate
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1',
      'http://104.142.122.231',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
