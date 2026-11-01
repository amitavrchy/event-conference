import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const origins = (process.env.CLIENT_ORIGIN ?? process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const local of [
    'http://localhost:3000',
    'http://localhost:3010',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3010',
  ]) {
    if (!origins.includes(local)) origins.push(local);
  }

  app.enableCors({ origin: origins, credentials: true });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (/^\/api\/(auth|tickets|check-in|agenda|admin)(\/|$)/.test(req.path)) {
      res.setHeader('Cache-Control', 'private, no-store');
    }
    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
      req.headers.origin &&
      !origins.includes(req.headers.origin)
    ) {
      res.status(403).json({ message: 'This request origin is not permitted.' });
      return;
    }
    next();
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`NEXUS API listening on http://${host}:${port}/api`);
}
await bootstrap();