import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {User} from "../../domain/entities/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto, UpdateUserDto} from "../../domain/dto/user.dto";
import admin from "firebase-admin";
import {CreateFullUserDto} from "../../domain/dto/full-user.dto";
import {UserProfileService} from "./user-profile.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userProfileService: UserProfileService,
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
            const firebaseUser = await admin.auth().createUser({
                email: newUser.email,
                password: newUser.password,
            });
            const user = this.userRepository.create(newUser);
            user.password = newUser.password;
            user.firebase_uid = firebaseUser.uid;
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
    // TODO: Update use real uid
    async update(id: number, updateUser: UpdateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({where: {id}});

        if (!existingUser) {
            throw new UnauthorizedException(`The user with ID ${id} was not found.`);
        }

        existingUser.email = updateUser.email || existingUser.email;
        existingUser.password = updateUser.password || existingUser.password;
        const uid: string = "Tl0HDf7au9PCHnpFvgOKie9KBL82";

        try {
            await admin.auth().updateUser(uid, {
                email: existingUser.email,
                password: existingUser.password,
            });
            existingUser.password = updateUser.password;
            return await this.userRepository.save(existingUser).then((user) => {
                delete user.password;
                return user;
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number): Promise<String> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new UnauthorizedException(`The user with ID ${id} was not found.`);
        }

        try {
            const uid: string = "Tl0HDf7au9PCHnpFvgOKie9KBL82";
            await admin.auth().deleteUser(uid);
            await this.userRepository.delete(id);
            return `The user with ID ${id} was deleted.`;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async createFullUser(userData: CreateFullUserDto): Promise<User> {
        const user = this.create(new CreateUserDto(userData.email, userData.password));
        userData.user_id = (await user).id;
        await this.userProfileService.create(userData);
        return user;
    }
}