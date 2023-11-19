import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../interfaces/controllers/auth.controller';
import { jwtConstants } from '../../constants';
import { FirebaseAuthMiddleware } from "../../../middleware/firebase.auth.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../../users/domain/entities/user.entity";
import { UserModule } from "../../../users/domain/modules/user.module";
import { FirebaseService } from "../../../configuration/firebase.config";
import {UserProfileModule} from "../../../users/domain/modules/user-profile.module";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([User]),
    UserProfileModule
  ],
  providers: [AuthService, FirebaseService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(FirebaseAuthMiddleware)
  }
}