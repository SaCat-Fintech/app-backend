import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FirebaseAuthMiddleware } from "../../../middleware/firebase.auth.middleware";

import { FrenchFeeService } from "../../infrastructure/services/french-fee.service";
import { FrenchFeeController } from "../../interfaces/controllers/french-fee.controller";
import { FrenchFee } from '../entities/french-fee.entity';

import { UserProfile } from 'src/users/domain/entities/user-profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FrenchFee, UserProfile])],
    providers: [FrenchFeeService],
    controllers: [FrenchFeeController],
    exports: [TypeOrmModule],
})
export class FrenchFeesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(FirebaseAuthMiddleware)
            .forRoutes(FrenchFeeController);
    }
}
