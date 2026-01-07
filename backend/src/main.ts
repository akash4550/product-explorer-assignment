import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit'; // Security Best Practice

async function bootstrap() {
  const logger = new Logger('Bootstrap'); // Better log context
  const app = await NestFactory.create(AppModule);

  // 1. Security: Enable CORS & Rate Limiting
  app.enableCors(); // Allows frontend on port 3001 to talk to backend on 3000
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }),
  );

  // 2. Configuration: Global Prefix & Validation
  app.setGlobalPrefix('api'); // Routes become /api/products
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, // Strips away extra data sent by malicious users
      transform: true, // Automatically transforms payloads to DTO instances
    })
  );

  // 3. Documentation: Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('AbleSpace Product Explorer')
    .setDescription('API documentation for the Scraper & Product Library')
    .setVersion('1.0')
    .addTag('products')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. Start Server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();