import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from 'typeorm';
import {UserProfile} from "./user-profile.entity";
import {ApiProperty} from "@nestjs/swagger";
@Entity({ name: 'roles' })
export class Role {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
    name: string;
    @ApiProperty()
    @Column({ type: 'varchar', length: 100, nullable: false })
    description: string;

    @ManyToMany(() => UserProfile, (userProfile) => userProfile.roles)
    userProfiles: UserProfile[];
}