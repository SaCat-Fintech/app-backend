import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfileService } from "../../../users/infrastructure/services/user-profile.service";
import { HistoryDto } from "../../domain/dto/history.dto";
import { InputData } from "../../domain/entities/input-data.entity";
import { PayRun } from "../../domain/entities/pay-run.entity";
import { PaymentInstallment } from "../../domain/entities/payment-installment.entity";
import { Rate } from "../../domain/entities/rate.entity";

import { calculateAnnualEffectiveRate, calculateDiscountRate, calculateEffectiveRateByPaymentFrequency, calculateFinancedBalanceInstallment, calculateInternalRateOfReturn, calculateNetPresentValue, calculatePaymentInstallments, getPeriodDays, roundNumber } from "src/french-method/utils/calculations.helper";

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
            rate_period: payRun.inputData.rate.rate_period,
            payment_frequency: payRun.inputData.payment_frequency,
        } as HistoryDto));
    }


    async createPayRunWithInstallments(inputData: InputData, userId: number): Promise<PayRun> {
        console.log('create', inputData)
        const userProfile = await this.userProfileService.findOne(userId);

        const rate = this.rateRepository.create(inputData.rate);
        await this.rateRepository.save(rate);
        const input = this.inputDataRepository.create(inputData);
        input.rate = rate;
        await this.inputDataRepository.save(input);

        let { payment_installments, rentability_results } = this.generateFrenchAmortizationSchedule(input)

        const paymentInstallments = this.paymentInstallmentRepository.create(payment_installments);
        await this.paymentInstallmentRepository.save(paymentInstallments);
        const payRun = this.payRunRepository.create();
        payRun.inputData = input;
        payRun.paymentInstallments = paymentInstallments;
        payRun.userProfile = userProfile;
        //TODO: save rentability results
        //payRun.profitabilityIndicator = rentability_results;
        return await this.payRunRepository.save(payRun);
    }

    private generateFrenchAmortizationSchedule(inputData: InputData) {
        let { id, currency, vehicle_cost, initial_payment_percentage, financing_percentage, rate: {rate_type, rate_period, rate_value, capitalization_period}, payment_frequency, amount_of_fees, cok_percentage, gracePeriods } = inputData;

        id = +id;
        vehicle_cost = +vehicle_cost;
        initial_payment_percentage = +initial_payment_percentage;
        financing_percentage = +financing_percentage;
        rate_value = +rate_value;
        amount_of_fees = +amount_of_fees;
        cok_percentage = +cok_percentage;


        // validations
        if (rate_type !== 'TEA' && rate_type !== 'TNA') throw new Error('Invalid rate type');
        if (capitalization_period !== 'monthly' && capitalization_period !== 'quarterly' && capitalization_period !== 'semi-annually' && capitalization_period !== 'annually') throw new Error('Invalid rate period');
        if (payment_frequency !== 'monthly' && payment_frequency !== 'quarterly' && payment_frequency !== 'semi-annually' && payment_frequency !== 'annually') throw new Error('Invalid payment frequency');

        // necessary variables
        const capitalization_period_days = getPeriodDays(capitalization_period);
        const payment_frequency_days = getPeriodDays(payment_frequency);

        const days_per_year = 360;


        // financing results

        const final_fee = roundNumber(1-initial_payment_percentage-financing_percentage);
        const number_of_years = amount_of_fees/12;     

        const annual_effective_rate = calculateAnnualEffectiveRate(rate_type, rate_value, days_per_year, capitalization_period_days);

        const effective_rate_by_payment_frequency = calculateEffectiveRateByPaymentFrequency(payment_frequency_days, annual_effective_rate, days_per_year);

        const rates_per_year = days_per_year/payment_frequency_days
        // amount of fees is already a number type

        const initial_fee_ammount = vehicle_cost*initial_payment_percentage;
        const final_fee_ammount = vehicle_cost*final_fee;
        const lease_amount = vehicle_cost - initial_fee_ammount - final_fee_ammount;
        const financed_balance_with_installment = calculateFinancedBalanceInstallment(lease_amount, final_fee_ammount, effective_rate_by_payment_frequency, amount_of_fees);

        // french amortization schedule

        const payment_installments = calculatePaymentInstallments(financed_balance_with_installment, amount_of_fees, effective_rate_by_payment_frequency, gracePeriods);

        // some util results
        
        const installment_values_array = payment_installments.map((payment_installment) => payment_installment.installment);

        // rentability results

        const discount_rate = calculateDiscountRate(cok_percentage, payment_frequency_days, days_per_year);
        
        const internal_rate_of_return = calculateInternalRateOfReturn([lease_amount, ...installment_values_array])

        const annual_effective_cost_rate = Math.pow(1 + internal_rate_of_return, days_per_year/payment_frequency_days) - 1;

        const net_present_value = calculateNetPresentValue(lease_amount, discount_rate, installment_values_array);

        return {
            payment_installments: payment_installments,
            rentability_results: {
                discount_rate: discount_rate,
                internal_rate_of_return: internal_rate_of_return,
                annual_effective_cost_rate: annual_effective_cost_rate,
                net_present_value: net_present_value
            }
        };
    }

    // async findDetail(id: number): Promise<PayRun> {
    async findDetail(id: number): Promise<any> {
        const payRun = await this.payRunRepository.findOne({where: {id}, relations: ['inputData', 'paymentInstallments']});

        //TODO: remove this when the profitabilty indicator is saved in the database
        const { inputData } = payRun;
        const rate = await this.rateRepository.findOne({where: {id: 3}});
        inputData.rate = rate;
        
        const results = this.generateFrenchAmortizationSchedule(inputData);
        


        if (!payRun) {
            throw new NotFoundException(`The pay run with ID ${id} was not found.`);
        }
        return {
            ...payRun,
            profitabilityIndicator: results.rentability_results
        };
    }
}