import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'profitability-indicators'})
export class ProfitabilityIndicator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    discount_rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    internal_rate_of_return: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    annual_effective_cost_rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    net_present_value: number;

    
}