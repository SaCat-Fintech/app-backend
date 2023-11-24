import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { config } from "./configuration/swagger.configuration";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  const configService = app.get(ConfigService);
  const googleApplicationCredentials = configService.get<string>(
    "GOOGLE_APPLICATION_CREDENTIALS",
  );

  const serviceAccount = require(googleApplicationCredentials);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  app.enableCors({
    origin: configService.get<string>("FRONT_URL"),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(3000);
}

bootstrap();
