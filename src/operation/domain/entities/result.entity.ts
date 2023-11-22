
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
import { SourceInput } from './source-input.entity';

@Entity({ name: 'results'})
export class Result {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'float', nullable: false })
    VAN: number;

    @ApiProperty()
    @Column({ type: 'float', nullable: false })
    TIR: number;

    @ApiProperty()
    @Column({ type: 'float', nullable: false })
    fee_ammount: number;
}