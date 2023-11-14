import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TypeOrmConfigService } from "./configuration/TypeOrmConfigService";

import { AuthModule } from './auth/domain/modules/auth.module';
import { FrenchFeesModule } from './french-fee/domain/modules/french-fee.module';
import { RolesModule } from "./users/domain/modules/roles.module";
import { UserProfileModule } from "./users/domain/modules/user-profile.module";
import { UserModule } from "./users/domain/modules/user.module";

@Module({
  imports: [AuthModule, UserModule, RolesModule, UserProfileModule, FrenchFeesModule,
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
