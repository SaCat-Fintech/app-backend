import { ApiProperty } from "@nestjs/swagger";
import { FrenchFee } from 'src/french-fee/domain/entities/french-fee.entity';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Role } from "./role.entity";
import { User } from "./user.entity";
import {PayRun} from "../../../french-method/domain/entities/pay-run.entity";
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
    @Column({ type: 'timestamp' })
    birthdate: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToOne(() => User, user => user.userProfile, { eager: true })
    @JoinColumn({ name: 'user_id'})
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

    @OneToMany(() => PayRun, payRun => payRun.userProfile)
    payRuns: PayRun[];


    @OneToMany(() => FrenchFee, frenchFee => frenchFee.userProfile, { eager: true })
    @ApiProperty({ type: () => [FrenchFee] })
    frenchFees: FrenchFee[];
}