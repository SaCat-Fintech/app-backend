import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from "../entities/user-profile.entity";
import {UserProfileService} from "../../infrastructure/services/user-profile.service";
import {UserProfileController} from "../../interfaces/controllers/user-profile.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserProfile])],
    providers: [UserProfileService],
    controllers: [UserProfileController],
    exports: [TypeOrmModule],
})
export class UserProfileModule {}
