import { ApiProperty } from "@nestjs/swagger";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { InputData } from "./input-data.entity";

@Entity({ name: "grace-periods" })
export class GracePeriod {
  @PrimaryGeneratedColumn()
  id: number;
  // TODO CORRECT: OPTIONAL
  @ApiProperty({ enum: ["TOTAL", "PARTIAL"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  type: string;
  // TODO CORRECT: consider dictionary of grace_period values, they can be from 1 to 3
  @ApiProperty()
  @Column({ type: "int", nullable: false })
  period_number: number;

  @ManyToOne(() => InputData, (inputData) => inputData.gracePeriods)
  @JoinColumn({ name: "input_data_id" })
  inputData: InputData;
}
