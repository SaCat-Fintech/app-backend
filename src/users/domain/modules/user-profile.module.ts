import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from "../entities/user-profile.entity";
import {UserProfileService} from "../../infrastructure/services/user-profile.service";
import {UserProfileController} from "../../interfaces/controllers/user-profile.controller";
import {User} from "../entities/user.entity";
import {Role} from "../entities/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role, UserProfile])],
    providers: [UserProfileService],
    controllers: [UserProfileController],
    exports: [TypeOrmModule],
})
export class UserProfileModule {}
