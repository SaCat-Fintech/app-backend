import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../entities/user.entity";
import { UserService } from "../../infrastructure/services/user.service";
import { UserController } from "../../interfaces/controllers/user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers: [UserController],
    exports: [TypeOrmModule],
})
export class UserModule {}
