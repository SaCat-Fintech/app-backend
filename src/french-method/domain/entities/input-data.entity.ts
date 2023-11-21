import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import {Rate} from "./rate.entity";
import {GracePeriod} from "./grace-period.entity";

@Entity({ name: 'input-data'})
export class InputData {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty( { enum: ['USD', 'EUR', 'PEN']})
    @Column({ type: 'varchar', length: 32, nullable: false })
    currency: string;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    vehicle_cost: number;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    initial_payment_percentage: number;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    financing_percentage: number;

    @ApiProperty()
    @OneToOne(() => Rate)
    @JoinColumn()
    rate: Rate;

    @ApiProperty({ enum: ['monthly', 'quarterly', 'semi-annually', 'annually']})
    @Column({ type: 'varchar', length: 32, nullable: false})
    payment_frequency: string;

    @ApiProperty({ enum: [24, 36]})
    @Column({ type: 'int', nullable: false})
    amount_of_fees: number;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    cok_percentage: number;

    @ApiProperty()
    @OneToMany(() => GracePeriod, gracePeriod => gracePeriod.inputData, { eager: true})
    gracePeriods: GracePeriod[];
}