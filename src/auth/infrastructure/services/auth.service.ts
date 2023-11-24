import {Injectable, UnauthorizedException } from '@nestjs/common';
import { signInWithEmailAndPassword } from "firebase/auth";
import { CreateUserDto } from "../../../users/domain/dto/user.dto";
import { FirebaseService } from "../../../configuration/firebase.config";
import { LoginResponseDto } from "../../domain/dto/login-response.dto";
import { UserProfileService } from "../../../users/infrastructure/services/user-profile.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userProfileService: UserProfileService,
    ) {}

    async signIn(createUserDto: CreateUserDto): Promise<LoginResponseDto> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.firebaseService.auth, createUserDto.email, createUserDto.password);
            const token = await userCredential.user.getIdToken();
            const user = await this.userProfileService.findByFirebaseUid(userCredential.user.uid);
            return new LoginResponseDto(token, user);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

}