import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: '*',
  });

  // ===== FRONTEND SERVE (MUHIM) =====
  const frontendPath = join(__dirname, '..', 'public');
  app.use(express.static(frontendPath));

  // SPA routing (React/Vite uchun)
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(join(frontendPath, 'index.html'));
    }
  });

  // ===== SWAGGER =====
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('Learning Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ===== PORT (ENG MUHIM) =====
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Render uchun MUHIM

  logger.log(`🚀 Server running on port ${port}`);
}

bootstrap();