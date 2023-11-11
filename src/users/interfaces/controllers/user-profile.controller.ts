import {ApiBearerAuth, ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserProfileService } from "../../infrastructure/services/user-profile.service";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import { CreateUserProfileDto, UpdateUserProfileDto } from "../../domain/dto/user-profile.dto";

@ApiTags('user-profile')
//@ApiBearerAuth()
@Controller('user-profiles')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}
    @Get()
    @ApiResponse({ status: 200, type: [UserProfile], description: 'Get all user profiles.'})
    async findAll(): Promise<UserProfile[]> {
        return await this.userProfileService.findAll();
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: UserProfile, description: 'Get user profile by id.'})
    async findOne(@Param('id') id: number): Promise<UserProfile> {
        return await this.userProfileService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateUserProfileDto })
    @ApiResponse({ status: 201, /*type: UserProfile,*/ description: 'Create user profile.'})
    async create(@Body() userProfileData: CreateUserProfileDto): Promise<UserProfile> {
        return await this.userProfileService.create(userProfileData);
    }

    @Put(':id')
    @ApiBody({ type: UpdateUserProfileDto })
    @ApiResponse({ status: 200, type: UserProfile, description: 'Update user profile.'})
    async update(@Param('id') id: number, @Body() userProfileData: UpdateUserProfileDto): Promise<UserProfile> {
        return await this.userProfileService.update(id, userProfileData);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Delete user profile.'})
    async delete(@Param('id') id: number): Promise<String> {
        return await this.userProfileService.delete(id);
    }
}
