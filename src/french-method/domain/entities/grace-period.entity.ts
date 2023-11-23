import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { InputData } from "./input-data.entity";

@Entity({ name: "grace-periods" })
export class GracePeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: ["TOTAL", "PARTIAL", "NONE"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  type: string;
  
  @ApiProperty()
  @Column({ type: "int", array: true, nullable: false })
  period_numbers: [number];

  @OneToOne(() => InputData, inputData => inputData.gracePeriod)
  inputData: InputData;
}
