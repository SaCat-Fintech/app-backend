import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne, JoinColumn} from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { hash } from 'bcrypt';
import {UserProfile} from "./user-profile.entity";

@Entity({ name: 'users'})
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
    email: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 100, nullable: false })
    password_hash: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: false })
    firebase_uid: string;

    @OneToOne(() => UserProfile, userProfile => userProfile.user, { lazy: true })
    userProfile: UserProfile;

    password: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password)
            this.password_hash = await hash(this.password, 10);
    }

}