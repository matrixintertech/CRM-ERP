import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ==========================
  // Security
  // ==========================
  app.use(helmet());

  app.use(compression());

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:5173'], 
    credentials: true,
  });

  // ==========================
  // Global Prefix
  // ==========================
  app.setGlobalPrefix('api/v1');

  // ==========================
  // Global Validation
  // ==========================
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

  // ==========================
  // Global Exception Filter
  // ==========================
  app.useGlobalFilters(new AllExceptionsFilter());

  // ==========================
  // Global Response Interceptor
  // ==========================
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ==========================
  // Swagger
  // ==========================
  setupSwagger(app);

  // ==========================
  // Start Server
  // ==========================
  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`🚀 Server   : http://localhost:${port}`);
  console.log(`📚 Swagger : http://localhost:${port}/api/v1/docs`);
}

bootstrap();