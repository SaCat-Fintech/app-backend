import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { databaseConfig } from "./database.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RolesModule} from "./users/domain/modules/roles.module";
import {UserProfileModule} from "./users/domain/modules/user-profile.module";

@Module({
  imports: [AuthModule, UsersModule, RolesModule, UserProfileModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
