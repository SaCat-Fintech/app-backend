import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PayRun } from "./pay-run.entity";

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

    constructor(payment_number: number, initial_balance: number, interest_amount:number, payment_amount: number, amortization: number, installment: number, outstanding_balance: number) {
        this.payment_number = payment_number;
        this.initial_balance = initial_balance;
        this.interest_amount = interest_amount;
        this.payment_amount = payment_amount;
        this.amortization = amortization;
        this.installment = installment;
        this.outstanding_balance = outstanding_balance;
    }
}