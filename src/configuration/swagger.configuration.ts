import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle('NestJS Firebase Auth')
    .setDescription('NestJS Firebase Auth')
    .setVersion('1.0')
    .addTag('NestJS Firebase Auth')
    .addBearerAuth()
    .build();
