import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {

    constructor(private readonly configService: ConfigService) {}
    
    async use(req: Request, res: Response, next: NextFunction) {

        if (this.configService.get<string>('ENVIRONMENT') === 'development') return next();
        
        const idToken = req.headers.authorization;
        if (!idToken) {
            throw new UnauthorizedException('Missing token');
        }
        const jwt = req.headers.authorization.split(' ')[1];
        try {
            await admin.auth().verifyIdToken(jwt);
            next();
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
