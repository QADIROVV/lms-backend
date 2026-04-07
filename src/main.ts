import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import * as express from 'express';
import { Request, Response } from 'express'; // ✅ MUHIM

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({ origin: '*' });

  // Frontend serve
  const frontendPath = join(__dirname, '..', 'public');
  app.use(express.static(frontendPath));

  // ✅ FIX QILINDI
  app.use('/', (req: Request, res: Response) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(join(frontendPath, 'index.html'));
    }
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server running on port ${port}`);
}

bootstrap();