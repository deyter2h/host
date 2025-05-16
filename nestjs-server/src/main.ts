import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payloads to DTO instances
      whitelist: true, // Removes properties not defined in the DTOs
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are sent
      disableErrorMessages: false, // Optionally disable detailed error messages (for production)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
