import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'profitability-indicators'})
export class ProfitabilityIndicator {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    discount_rate: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    tir_percentage: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    tcea_percentage: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    van: number;
}