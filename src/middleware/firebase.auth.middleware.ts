import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
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
