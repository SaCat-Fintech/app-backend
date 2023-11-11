import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const googleApplicationCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const serviceAccount = require(googleApplicationCredentials);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('NestJS Firebase Auth')
      .setDescription('NestJS Firebase Auth')
      .setVersion('1.0')
      .addTag('NestJS Firebase Auth')
      .addTag('auth')
      .addTag('role')
      .addTag('user-profile')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
