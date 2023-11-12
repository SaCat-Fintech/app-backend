import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import { CreateUserDto } from "../../../users/domain/dto/user.dto";
import {User} from "../../../users/domain/entities/user.entity";
import {UserService} from "../../../users/infrastructure/services/user.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
        ) {}

    @Post('signIn')
    async signIn(@Body() userData: CreateUserDto): Promise<string> {
        return await this.authService.signIn(userData);
    }
    @Post('signUp')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, type: User, description: 'Create user.'})
    async createUser(@Body() userData: CreateUserDto): Promise<User> {
        return await this.userService.create(userData);
    }

}
