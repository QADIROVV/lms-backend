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

  // 1. API prefix - hamma API so'rovlar /api/v1 bilan boshlanadi
  app.setGlobalPrefix('api/v1');

  // 2. CORS - Frontend va Backend bitta linkda bo'lsa ham '*' turgani xavfsiz
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Global Error Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. SWAGGER (Faqat /api manzili orqali kiriladi)
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('LMS platformasi uchun API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger endi /api/docs da

  /**
   * ── FRONTENDNI SERVE QILISH (SPA FIX) ──────────────────────────────
   * Render-da backend 'dist' ichida ishlaydi. 
   * Frontend 'public' papkasiga joylanishi kerak.
   */
  const frontendPath = join(__dirname, '..', 'public'); 
  
  // Statik fayllarni (js, css, images) yuklash
  app.use(express.static(frontendPath));

  // SPA Routing: Agar so'rov /api bilan boshlanmasa, index.html ni qaytarish
  // Bu React Router (BrowserRouter) ishlashi uchun shart!
  const server = app.getHttpAdapter().getInstance();
  server.get('*', (req: any, res: any, next: any) => {
    const url = req.originalUrl;
    if (url.startsWith('/api/v1') || url.startsWith('/api/docs')) {
      return next();
    }
    res.sendFile(join(frontendPath, 'index.html'));
  });

  // 6. PORT sozlamasi
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server http://localhost:${port}/api/docs da ishga tushdi`);
}

bootstrap();