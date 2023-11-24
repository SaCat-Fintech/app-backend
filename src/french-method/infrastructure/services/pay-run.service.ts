import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfileService } from "../../../users/infrastructure/services/user-profile.service";
import { HistoryDto } from "../../domain/dto/history.dto";
import { InputData } from "../../domain/entities/input-data.entity";
import { PayRun } from "../../domain/entities/pay-run.entity";
import { PaymentInstallment } from "../../domain/entities/payment-installment.entity";
import { Rate } from "../../domain/entities/rate.entity";

import { FinancingResult } from "src/french-method/domain/entities/financing-results.entity";
import { GracePeriod } from "src/french-method/domain/entities/grace-period.entity";
import { ProfitabilityIndicator } from "src/french-method/domain/entities/profitability-indicator.entity";
import { calculateAnnualEffectiveRate, calculateDiscountRate, calculateEffectiveRateByPaymentFrequency, calculateFinancedBalanceInstallment, calculateInternalRateOfReturn, calculateNetPresentValue, calculatePaymentInstallments, getPeriodDays, roundNumber, validatePeriodType } from "src/french-method/utils/calculations.helper";

@Injectable()
export class PayRunService {
    constructor(
        @InjectRepository(PayRun)
        private readonly payRunRepository: Repository<PayRun>,
        @InjectRepository(PaymentInstallment)
        private readonly paymentInstallmentRepository: Repository<PaymentInstallment>,
        @InjectRepository(InputData)
        private readonly inputDataRepository: Repository<InputData>,
        @InjectRepository(Rate)
        private readonly rateRepository: Repository<Rate>,
        @InjectRepository(ProfitabilityIndicator)
        private readonly profitabilityIndicatorRepository: Repository<ProfitabilityIndicator>,
        @InjectRepository(GracePeriod)
        private readonly gracePeriodRepository: Repository<GracePeriod>,
        @InjectRepository(FinancingResult)
        private readonly financingResultRepository: Repository<FinancingResult>,
        private readonly userProfileService: UserProfileService,
    ) {}

    async findAll(): Promise<PayRun[]> {
        return await this.payRunRepository.find();
    }
    async findOne(id: number): Promise<PayRun> {
        const payRun = await this.payRunRepository.findOne({where: {id}});
        if (!payRun) {
            throw new NotFoundException(`The pay run with ID ${id} was not found.`);
        }
        return payRun;
    }

    async findByUserProfileId(userProfileId: number): Promise<HistoryDto[]> {
        const payRuns = await this.payRunRepository.find({ where: { userProfile: { id: userProfileId } },
            relations: ['inputData', 'inputData.rate'],
            order: { id: 'ASC' }
        });
        return payRuns.map((payRun) => ({
            id: payRun.id,
            created_at: payRun.created_at,
            vehicle_cost: payRun.inputData.vehicle_cost,
            currency: payRun.inputData.currency,
            rate_value: payRun.inputData.rate.rate_value ,
            rate_type: payRun.inputData.rate.rate_type,
            payment_years: payRun.inputData.amount_of_fees / 12,
            payment_frequency: payRun.inputData.payment_frequency,
        } as HistoryDto));
    }


    async createPayRunWithInstallments(inputData: InputData, userId: number): Promise<any> {

        try {
            const userProfile = await this.userProfileService.findOne(userId);

            const rate = this.rateRepository.create(inputData.rate);
            await this.rateRepository.save(rate);
            

            // Create and save the GracePeriod entity
            const gracePeriod = this.gracePeriodRepository.create(inputData.gracePeriod);
            await this.gracePeriodRepository.save(gracePeriod);
            

            const input = this.inputDataRepository.create(inputData);
            input.rate = rate;
            input.gracePeriod = gracePeriod;
            

            await this.inputDataRepository.save(input);
            

            let { payment_installments, profitability_indicator, financing_results } = this.generateFrenchAmortizationSchedule(input)
            

            const paymentInstallments = this.paymentInstallmentRepository.create(payment_installments);
            await this.paymentInstallmentRepository.save(paymentInstallments);
            

            const profitabilityIndicator = this.profitabilityIndicatorRepository.create(profitability_indicator);
            await this.profitabilityIndicatorRepository.save(profitabilityIndicator);

            const financingResult = this.financingResultRepository.create(financing_results);
            await this.financingResultRepository.save(financingResult);

            const payRun = this.payRunRepository.create();
            payRun.inputData = input;
            payRun.paymentInstallments = paymentInstallments;
            payRun.userProfile = userProfile;
            payRun.profitabilityIndicator = profitabilityIndicator;
            payRun.financingResult = financingResult;

            const savedPayRun = await this.payRunRepository.save(payRun);
            return {
                id: savedPayRun.id,
                created_at: savedPayRun.created_at,
            };
        } catch (error) {
            throw new Error(error)
        }

        
    }

    private generateFrenchAmortizationSchedule(inputData: InputData) {

        let { id, currency, vehicle_cost, initial_payment_percentage, financing_percentage, rate: {rate_type, rate_period, rate_value, capitalization_period}, payment_frequency, amount_of_fees, cok_percentage, gracePeriod } = inputData;

        id = +id;
        vehicle_cost = +vehicle_cost;
        initial_payment_percentage = +initial_payment_percentage;
        financing_percentage = +financing_percentage;
        rate_value = +rate_value;
        amount_of_fees = +amount_of_fees;
        cok_percentage = +cok_percentage;


        // validations
        if (rate_type !== 'EFFECTIVE' && rate_type !== 'NOMINAL') throw new Error('Invalid rate type');

        let capitalization_period_v = validatePeriodType(capitalization_period);
        let payment_frequency_v = validatePeriodType(payment_frequency);
        let rate_period_v = validatePeriodType(rate_period);

        // necessary variables
        const capitalization_period_days = getPeriodDays(capitalization_period_v);
        const payment_frequency_days = getPeriodDays(payment_frequency_v);
        const rate_period_days = getPeriodDays(rate_period_v);

        const days_per_year = 360;


        // financing results

        const final_fee = roundNumber(1-initial_payment_percentage-financing_percentage);
        const number_of_years = amount_of_fees/12;     

        const annual_effective_rate = calculateAnnualEffectiveRate(rate_type, rate_value, days_per_year, capitalization_period_days, rate_period_days);

        const effective_rate_by_payment_frequency = calculateEffectiveRateByPaymentFrequency(payment_frequency_days, annual_effective_rate, days_per_year);

        const rates_per_year = days_per_year/payment_frequency_days
        // amount of fees is already a number type

        const initial_fee_ammount = vehicle_cost*initial_payment_percentage;
        const final_fee_ammount = vehicle_cost*final_fee;
        const lease_amount = vehicle_cost - initial_fee_ammount - final_fee_ammount;
        const financed_balance_with_installment = calculateFinancedBalanceInstallment(lease_amount, final_fee_ammount, effective_rate_by_payment_frequency, amount_of_fees);

        // french amortization schedule

        const payment_installments = calculatePaymentInstallments(financed_balance_with_installment, amount_of_fees, effective_rate_by_payment_frequency, gracePeriod, final_fee_ammount);

        // some util results
        
        const installment_values_array = payment_installments.map((payment_installment) => payment_installment.installment);

        // rentability results

        const discount_rate = calculateDiscountRate(cok_percentage, payment_frequency_days, days_per_year);
        
        const internal_rate_of_return = calculateInternalRateOfReturn([lease_amount, ...installment_values_array])

        const annual_effective_cost_rate = Math.pow(1 + internal_rate_of_return, days_per_year/payment_frequency_days) - 1;

        const net_present_value = calculateNetPresentValue(lease_amount, discount_rate, installment_values_array);

        return {
            financing_results: {
                final_fee: final_fee,
                number_of_years: number_of_years,
                annual_effective_rate: annual_effective_rate,
                effective_rate_by_payment_frequency: effective_rate_by_payment_frequency,
                rates_per_year: rates_per_year,
                initial_fee_ammount: initial_fee_ammount,
                final_fee_ammount: final_fee_ammount,
                lease_amount: lease_amount,
                financed_balance_with_installment: financed_balance_with_installment
            },
            payment_installments: payment_installments,
            profitability_indicator: {
                discount_rate: discount_rate,
                internal_rate_of_return: internal_rate_of_return,
                annual_effective_cost_rate: annual_effective_cost_rate,
                net_present_value: net_present_value
            }
        };
    }

    // async findDetail(id: number): Promise<PayRun> {
    async findDetail(id: number): Promise<any> {
        const payRun = await this.payRunRepository.findOne({where: {id}, relations: ['inputData', 'inputData.rate', 'inputData.gracePeriod', 'paymentInstallments', 'profitabilityIndicator', 'financingResult']});

        if (!payRun) {
            throw new NotFoundException(`The pay run with ID ${id} was not found.`);
        }
        return payRun;
    }
}