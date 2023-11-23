import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "rates" })
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;
  // TODO CORRECT: effective, nominal
  @ApiProperty({ enum: ["TEA", "TNA"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  rate_type: string;
  // TODO CORRECT: { name: "Annual" }, { name: "Semester" }, { name: "Quatrimesterly" }, { name: "Quarterly" }, { name: "Bimonthly" }, { name: "Monthly" }, { name: "Fortnightly" }, { name: "Diary" },
  // OPTIONAL: effective -> none, nominal -> yessss
  @ApiProperty({ enum: ["monthly", "quarterly", "semi-annually", "annually"] })
  @Column({ type: "varchar", length: 32, nullable: false })
  rate_period: string;
  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 4, nullable: false })
  rate_value: number;
  // TODO CORRECT: { name: "Annual" }, { name: "Semester" }, { name: "Quatrimesterly" }, { name: "Quarterly" }, { name: "Bimonthly" }, { name: "Monthly" }, { name: "Fortnightly" }, { name: "Diary" },
  @ApiProperty({ enum: ["monthly", "quarterly", "semi-annually", "annually"] })
  @Column({ type: "varchar", length: 32, nullable: true })
  capitalization_period: string;
}
