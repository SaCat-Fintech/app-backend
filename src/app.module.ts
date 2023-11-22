import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TypeOrmConfigService } from "./configuration/TypeOrmConfigService";

import { AuthModule } from './auth/domain/modules/auth.module';
import { InputDataModule } from "./french-method/domain/modules/input-data.module";
import { PayRunModule } from "./french-method/domain/modules/pay-run.module";
import { RolesModule } from "./users/domain/modules/roles.module";
import { UserProfileModule } from "./users/domain/modules/user-profile.module";
import { UserModule } from "./users/domain/modules/user.module";

@Module({
  imports: [AuthModule, PayRunModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
