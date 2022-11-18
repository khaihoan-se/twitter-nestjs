import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Auto Validate
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
