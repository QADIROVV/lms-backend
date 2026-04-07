import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { Request, Response } from 'express';
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
      transform: true,
    }),
  );

  // Error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({ origin: '*' });

  /**
   * 🔥 ENG MUHIM QISM
   * Render productionda dist/public ishlaydi
   */
  const frontendPath = join(__dirname, 'public');

  app.use(express.static(frontendPath));

  // SPA routing fix
app.use((req: any, res: any, next: any) => {
  if (!req.originalUrl.startsWith('/api')) {
    return res.sendFile(join(frontendPath, 'index.html'));
  }
  next();
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