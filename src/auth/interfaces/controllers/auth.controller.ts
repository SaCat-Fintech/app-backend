import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.service';
import { ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import { CreateUserDto } from "../../../users/domain/dto/user.dto";
import { User } from "../../../users/domain/entities/user.entity";
import { UserService } from "../../../users/infrastructure/services/user.service";
import { CreateFullUserDto } from "../../../users/domain/dto/full-user.dto";
import { LoginResponseDto } from "../../domain/dto/login-response.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('signIn')
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, type: LoginResponseDto, description: 'Login user.'})
    async signIn(@Body() userData: CreateUserDto): Promise<LoginResponseDto> {
        return await this.authService.signIn(userData);
    }
    @Post('signUp')
    @ApiBody({ type: CreateFullUserDto })
    @ApiResponse({ status: 201, type: User, description: 'Create user.'})
    async createFullUser(@Body() userData: CreateFullUserDto): Promise<User> {
        return await this.userService.createFullUser(userData);
    }

}
