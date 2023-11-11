import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from "./user.entity";
import { Role } from "./role.entity";
import {ApiProperty} from "@nestjs/swagger";
@Entity({ name: 'user_profiles' })
export class UserProfile {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 8, nullable: false })
    dni: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: false })
    first_name: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: false })
    last_name: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: true })
    phone_number: string;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: true })
    firebase_uid: string;

    @ApiProperty()
    @Column({ type: 'int', nullable: false })
    user_id: number;

    @ApiProperty()
    @OneToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToMany(() => Role, (role) => role.userProfiles, { eager: true })
    @JoinTable({
        name: 'user_profile_roles',
        joinColumn: {
            name: 'user_profile_id',
        },
        inverseJoinColumn: {
            name: 'role_id',
        },
    })
    @ApiProperty()
    roles: Role[];
}