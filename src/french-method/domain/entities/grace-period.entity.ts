import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InputData } from "./input-data.entity";

@Entity({ name: 'grace-periods'})
export class GracePeriod {
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty({ enum: ['TOTAL', 'PARTIAL']})
    @Column({ type: 'varchar', length: 32, nullable: false })
    type: string;
    @ApiProperty()
    @Column({ type: 'int', nullable: false})
    value: number;
    @ApiProperty()
    @Column({ type: 'int', nullable: false})
    period_number: number;

    @ManyToOne(() => InputData, inputData => inputData.gracePeriods)
    inputData: InputData;
}