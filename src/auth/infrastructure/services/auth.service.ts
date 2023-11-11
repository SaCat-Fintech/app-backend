import {Injectable, Dependencies, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from "../../../users/domain/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import admin, {auth } from "firebase-admin";
import UserRecord = auth.UserRecord;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async delete(id: number): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new UnauthorizedException(`The user with ID ${id} was not found.`);
        }

        return await this.userRepository.remove(user);
    }
    //TODO: Update user
    //TODO: Delete user

    /*
    async signIn(username, pass) {
        const user = await this.usersService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
     */
}