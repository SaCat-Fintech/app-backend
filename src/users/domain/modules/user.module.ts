import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../entities/user.entity";
import { UserService } from "../../infrastructure/services/user.service";
import { UserController } from "../../interfaces/controllers/user.controller";
import {FirebaseAuthMiddleware} from "../../../middleware/firebase.auth.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers: [UserController],
    exports: [TypeOrmModule],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(FirebaseAuthMiddleware)
            .exclude({path: 'users', method: RequestMethod.POST})
            .forRoutes(UserController);
    }
}
