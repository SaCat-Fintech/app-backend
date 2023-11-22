
import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { UserProfile } from 'src/users/domain/entities/user-profile.entity';
import { Result } from './result.entity';
import { SourceInput } from './source-input.entity';

@Entity({ name: 'pay_runs'})
export class PayRun {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => UserProfile, userProfile => userProfile.frenchFees)
    @ApiProperty({ type: () => UserProfile })
    userProfile: UserProfile;

    @OneToOne(() => SourceInput)
    @JoinColumn({ name: 'source_input_id'})
    sourceInput: SourceInput;

    @OneToOne(() => Result)
    @JoinColumn({ name: 'results_id'})
    result: Result;
}