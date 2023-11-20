import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PayRun} from "./pay-run.entity";

@Entity({ name: 'payment-installments'})
export class PaymentInstallment {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'int', nullable: false})
    payment_number: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    initial_balance: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    payment_amount: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    interest_amount: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    amortization: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    installment: number;
    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false})
    outstanding_balance: number;

    @ManyToOne(() => PayRun, payRun => payRun.paymentInstallments)
    payRun: PayRun;
}