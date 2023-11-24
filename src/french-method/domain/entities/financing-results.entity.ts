import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'financing-results'})
export class FinancingResult {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    final_fee: number;

    @Column({type: 'int', nullable: false})
    number_of_years: number;

    @Column({type: 'decimal', precision: 10, scale: 4, nullable: false})
    annual_effective_rate: number;

    @Column({type: 'decimal', precision: 10, scale: 4, nullable: false})
    effective_rate_by_payment_frequency: number;

    @Column({type: 'int', nullable: false})
    rates_per_year: number;

    @Column({type: 'decimal', precision: 10, scale: 4, nullable: false})
    initial_fee_ammount: number;

    @Column({type: 'decimal', precision: 10, scale: 4, nullable: false})
    final_fee_ammount: number;

    @Column({type: 'decimal', precision: 10, scale: 4, nullable: false})
    lease_amount: number;

    @Column({type: 'decimal', precision: 10, scale: 4, nullable: false})
    financed_balance_with_installment: number;
}