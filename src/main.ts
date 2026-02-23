import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  (app.use(
    cookieSession({
      keys: ['nestjs', 'nodejs', 'typescript'],
    }),
  ),
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    ));
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Listening on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
