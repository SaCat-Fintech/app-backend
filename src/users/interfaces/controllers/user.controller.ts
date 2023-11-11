import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {ApiBearerAuth, ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import { User } from "../../domain/entities/user.entity";
import { UserService} from "../../infrastructure/services/user.service";
import { CreateUserDto, UpdateUserDto } from "../../domain/dto/user.dto";

@ApiTags('user')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @ApiBearerAuth()
    @Get()
    @ApiResponse({ status: 200, type: [User], description: 'Get all users.'})
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @ApiBearerAuth()
    @Get(':id')
    @ApiResponse({ status: 200, type: User, description: 'Get user by id.'})
    async findOne(@Param('id') id: number): Promise<User> {
        return await this.userService.findOne(id);
    }
    @Post('')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, type: User, description: 'Create user.'})
    async createUser(@Body() userData: CreateUserDto): Promise<User> {
        return await this.userService.create(userData);
    }

    @ApiBearerAuth()
    @Put(':id')
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 201, type: User, description: 'Update user.'})
    async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto): Promise<User> {
        return await this.userService.update(id, userData);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Delete user.'})
    async deleteUser(@Param('id') id: number): Promise<String> {
        return await this.userService.delete(id);
    }
}

