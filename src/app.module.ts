import { Module } from '@nestjs/common';
import { AuthModule } from './auth/domain/modules/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "./users/domain/modules/roles.module";
import { UserProfileModule } from "./users/domain/modules/user-profile.module";
import { UserModule } from "./users/domain/modules/user.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmConfigService } from "./configuration/TypeOrmConfigService";

@Module({
  imports: [AuthModule, UserModule, RolesModule, UserProfileModule,
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
