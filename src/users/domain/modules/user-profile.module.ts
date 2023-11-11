import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from "../entities/user-profile.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserProfile])],
    providers: [],
    controllers: [],
    exports: [TypeOrmModule],
})
export class UserProfileModule {}
