import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //Swagger
  const config = new DocumentBuilder()
    .setTitle('UCA Hub')
    .setDescription('The place where you get to stay tuned with all the events happening in UCA.')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  //Validations
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();