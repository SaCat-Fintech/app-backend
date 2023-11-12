import {Injectable, UnauthorizedException } from '@nestjs/common';
import { signInWithEmailAndPassword } from "firebase/auth";
import { CreateUserDto } from "../../../users/domain/dto/user.dto";
import { FirebaseService } from "../../../configuration/firebase.config";

@Injectable()
export class AuthService {
    constructor(
        private readonly firebaseService: FirebaseService,
    ) {}

    async signIn(createUserDto: CreateUserDto): Promise<string> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.firebaseService.auth, createUserDto.email, createUserDto.password);
            return JSON.stringify({
                token: await userCredential.user.getIdToken(),
            });
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

}