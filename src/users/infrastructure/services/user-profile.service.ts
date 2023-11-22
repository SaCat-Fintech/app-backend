import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserProfileDto, UpdateUserProfileDto } from "../../domain/dto/user-profile.dto";
import { Role } from "../../domain/entities/role.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}
    async findAll(): Promise<UserProfile[]> {
        return await this.userProfileRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id: number): Promise<UserProfile> {
        const userProfile = await this.userProfileRepository.findOne({where: {id}});
        if (!userProfile) {
            throw new NotFoundException(`The user profile with ID ${id} was not found.`);
        }
        return userProfile;
    }
    async create(newUserProfile: CreateUserProfileDto): Promise<UserProfile> {
        const userId = newUserProfile.user_id;

        try {
            const existingProfile = await this.userProfileRepository.findOne({ where: { user: { id: userId } } });
            if (existingProfile) {
                throw new BadRequestException(`Ya existe un perfil para el usuario con ID ${userId}.`);
            }

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`No se encontró un usuario con ID ${userId}.`);
            }

            const newProfile = this.userProfileRepository.create(newUserProfile);
            newProfile.user = user;
            if (newUserProfile.role_ids && newUserProfile.role_ids.length > 0) {
                const roles = await this.roleRepository.findByIds(newUserProfile.role_ids);
                if (roles.length !== newUserProfile.role_ids.length) {
                    throw new NotFoundException('Uno o más roles proporcionados no fueron encontrados.');
                }
                newProfile.roles = roles;
            }

            return await this.userProfileRepository.save(newProfile);
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Usuario no encontrado');
            } else if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new Error('Ocurrió un error durante la creación del perfil.');
            }
        }
    }



    async update(id: number, updateUserProfile: UpdateUserProfileDto): Promise<UserProfile> {
        const existingUserProfile = await this.userProfileRepository.findOne({ where: { id } });

        if (!existingUserProfile) {
            throw new NotFoundException(`El perfil de usuario con ID ${id} no fue encontrado.`);
        }

        existingUserProfile.dni = updateUserProfile.dni || existingUserProfile.dni;
        existingUserProfile.first_name = updateUserProfile.first_name || existingUserProfile.first_name;
        existingUserProfile.last_name = updateUserProfile.last_name || existingUserProfile.last_name;
        existingUserProfile.birthdate = updateUserProfile.birthdate || existingUserProfile.birthdate;

        if (updateUserProfile.role_ids && updateUserProfile.role_ids.length > 0) {
            const roles = await this.roleRepository.findByIds(updateUserProfile.role_ids);
            if (roles.length !== updateUserProfile.role_ids.length) {
                throw new NotFoundException('Uno o más roles proporcionados no fueron encontrados.');
            }
            existingUserProfile.roles = roles;
        }

        return await this.userProfileRepository.save(existingUserProfile);
    }

    async delete(id: number): Promise<String> {
        const userProfile = await this.userProfileRepository.findOne({where: {id}});

        if (!userProfile) {
            throw new NotFoundException(`The user profile with ID ${id} was not found.`);
        }
        await this.userProfileRepository.delete(id);
        return `The user profile with ID ${id} was deleted.`;
    }
    async findByFirebaseUid(uid: string): Promise<UserProfile> {
        const user = await this.userRepository.findOne({where: {firebase_uid: uid},
            relations: ['userProfile']
        });
        if (!user) {
            throw new NotFoundException(`The user with UID ${uid} was not found.`);
        }
        return user.userProfile;
    }
}