import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PaymentInstallment} from "./payment-installment.entity";
import {InputData} from "./input-data.entity";

@Entity({ name: 'pay-runs'})
export class PayRun {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToOne(() => InputData)
    @JoinColumn()
    inputData: InputData;

    @OneToMany(() => PaymentInstallment, paymentInstallment => paymentInstallment.payRun)
    paymentInstallments: PaymentInstallment[];
}