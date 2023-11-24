import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "rates" })
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ enum: ["EFFECTIVE", "NOMINAL"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  rate_type: string;
  
  @ApiProperty({ enum: ["daily", "biweekly", "monthly", "bimonthly", "quarterly", "quatrimesterly", "semester", "annually"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  rate_period: string;
  
  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 4, nullable: false })
  rate_value: number;
  
  @ApiProperty({ enum: ["null", "daily", "biweekly", "monthly", "bimonthly", "quarterly", "quatrimesterly", "semester", "annually"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  capitalization_period: string;
}
