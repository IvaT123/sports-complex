import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Sports Complex API')
    .setDescription(
      'Sports Complex API is a RESTful API that allows users to enroll and disenroll from sports, filter classes by sport names, duration, age groups and days of the week. They can also check the information about existing sports and classes. Users must be verified to enroll in sports and to leave reviews.',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('sports')
    .addTag('classes')
    .addTag('dailySchedules')
    .addTag('reviews')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
