import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "../../../users/domain/entities/user-profile.entity";
import { FinancingResult } from "./financing-results.entity";
import { InputData } from "./input-data.entity";
import { PaymentInstallment } from "./payment-installment.entity";
import { ProfitabilityIndicator } from "./profitability-indicator.entity";

@Entity({ name: 'pay-runs'})
export class PayRun {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToOne(() => InputData)
    @JoinColumn({ name: 'input_data_id' })
    inputData: InputData;

    @OneToOne(() => ProfitabilityIndicator)
    @JoinColumn({ name: 'profitability_indicator_id'})
    profitabilityIndicator: ProfitabilityIndicator;

    @OneToOne(() => FinancingResult)
    @JoinColumn({ name: 'financing_result_id'})
    financingResult: FinancingResult;

    @OneToMany(() => PaymentInstallment, paymentInstallment => paymentInstallment.payRun)
    paymentInstallments: PaymentInstallment[];

    @ManyToOne(() => UserProfile, userProfile => userProfile.payRuns)
    @JoinColumn({ name: 'user_profile_id' })
    userProfile: UserProfile;
}