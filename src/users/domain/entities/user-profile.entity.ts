import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from "./user.entity";
import { Role } from "./role.entity";
@Entity({ name: 'user_profiles' })
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: 8, nullable: false })
    dni: string;
    @Column({ type: 'varchar', length: 32, nullable: false })
    first_name: string;
    @Column({ type: 'varchar', length: 32, nullable: false })
    last_name: string;
    @Column({ type: 'varchar', length: 32, nullable: true })
    phone_number: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    @Column({ type: 'varchar', length: 32, nullable: true })
    firebase_uid: string;

    @Column({ type: 'int', nullable: false })
    user_id: number;

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
    roles: Role[];
}