import {Injectable, Dependencies, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from "../../../users/domain/dto/user.dto";
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
    async findAll(): Promise<User[]> {
        return await this.userRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) {
            throw new UnauthorizedException(`The user with ID ${id} was not found.`);
        }
        return user;
    }
    async create(newUser: CreateUserDto): Promise<User> {
        try {
            await admin.auth().createUser({
                email: newUser.email,
                password: newUser.password,
            });
            const user = this.userRepository.create(newUser);
            user.password = newUser.password;
            return await this.userRepository.save(user).then((user) => {
                delete user.password;
                return user;
            });
        } catch (error) {
            if (error.code === '23505') {
                throw new UnauthorizedException('The email is already in use.');
            } else {
                throw new BadRequestException(error.message);
            }
        }
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