import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";

@Injectable()
export class FirebaseService {
    private readonly authFirebase;

    constructor(private readonly configService: ConfigService) {
        const firebaseConfig = {
            apiKey: this.configService.get<string>('API_KEY'),
            authDomain: this.configService.get<string>('AUTH_DOMAIN'),
            projectId: this.configService.get<string>('PROJECT_ID'),
            storageBucket: this.configService.get<string>('STORAGE_BUCKET'),
            messagingSenderId: this.configService.get<string>('MESSAGING_SENDER_ID'),
            appId: this.configService.get<string>('APP_ID'),
        };

        const app = initializeApp(firebaseConfig);
        this.authFirebase = getAuth(app);
    }

    get auth() {
        return this.authFirebase;
    }
}
