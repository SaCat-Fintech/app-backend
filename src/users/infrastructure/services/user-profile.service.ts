import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserProfile} from "../../domain/entities/user-profile.entity";
import {Repository} from "typeorm";
import {CreateUserProfileDto, UpdateUserProfileDto} from "../../domain/dto/user-profile.dto";

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
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
        try {
            return await this.userProfileRepository.save(newUserProfile);
        } catch (error) {
            throw error;
        }
    }
    async update(id: number, updateUserProfile: UpdateUserProfileDto): Promise<UserProfile> {
        const existingUserProfile = await this.userProfileRepository.findOne({where: {id}});

        if (!existingUserProfile) {
            throw new NotFoundException(`The user profile with ID ${id} was not found.`);
        }
        existingUserProfile.dni = updateUserProfile.dni || existingUserProfile.dni;
        existingUserProfile.first_name = updateUserProfile.first_name || existingUserProfile.first_name;
        existingUserProfile.last_name = updateUserProfile.last_name || existingUserProfile.last_name;
        existingUserProfile.phone_number = updateUserProfile.phone_number || existingUserProfile.phone_number;
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
}