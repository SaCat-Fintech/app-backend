import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { RoleService } from "../../infrastructure/services/role.service";
import { RoleController } from "../../interfaces/controllers/role.controller";
import { FirebaseAuthMiddleware } from "../../../middleware/firebase.auth.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [TypeOrmModule],
})
export class RolesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(FirebaseAuthMiddleware)
            .forRoutes(RoleController);
    }
}
