import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus, Param,
    Post, Put,
    Req,
    Request, Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {AuthGuard} from '../../auth.guard';
import {AuthService} from '../../infrastructure/services/auth.service';
import {auth} from "firebase-admin";
import UserRecord = auth.UserRecord;
import ListUsersResult = auth.ListUsersResult;
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../../../users/domain/entities/user.entity";
import {CreateUserDto, UpdateUserDto} from "../../../users/domain/dto/user.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /*
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: CreateUserDto})
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }
    */

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
    @Get('verifyToken')
    async verifyToken(@Req() request) {
        const idToken = request.headers.authorization;

        try {
            return await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            throw new UnauthorizedException('Token no válido');
        }
    }
    @Get('listUsers')
    async listUsers(): Promise<ListUsersResult> {
        try {
            return await admin.auth().listUsers();
        } catch (error) {
            throw new BadRequestException('' + error.message);
        }
    }
    @Get('user/:uid')
    async getUser(@Req() request): Promise<UserRecord> {
        const uid = request.params.uid;
        try {
            return await admin.auth().getUser(uid);
        } catch (error) {
            throw new BadRequestException('' + error.message);
        }
    }

    /*
    @Put('updateUser')
    async updateUser(@Body() userData: UpdateUserDto): Promise<UserRecord> {
        try {
             return await admin.auth().updateUser(userData.uid, {
                email: userData.email,
                password: userData.password,
            });
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el usuario: ' + error.message);
        }
    }
    */
    @Post('verifyEmail')
    async verifyEmail(@Body() userData: UpdateUserDto): Promise<string> {
        try {
            return await admin.auth().generateEmailVerificationLink(userData.email);
        } catch (error) {
            throw new BadRequestException('No se pudo verificar el email: ' + error.message);
        }
    }

    @Get('secret')
    async secret() {
        return "Top secret";
    }
}
