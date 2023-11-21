import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../interfaces/controllers/auth.controller';
import { FirebaseAuthMiddleware } from "../../../middleware/firebase.auth.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../../users/domain/entities/user.entity";
import { FirebaseService } from "../../../configuration/firebase.config";
import { UserService } from "../../../users/infrastructure/services/user.service";
import { UserProfileService } from "../../../users/infrastructure/services/user-profile.service";
import { UserProfile } from "../../../users/domain/entities/user-profile.entity";
import { Role } from "../../../users/domain/entities/role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Role]),
  ],
  providers: [AuthService, FirebaseService, UserService, UserProfileService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(FirebaseAuthMiddleware)
  }
}