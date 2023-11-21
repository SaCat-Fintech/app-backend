import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PayRun} from "../../domain/entities/pay-run.entity";
import {Repository} from "typeorm";
import {InputData} from "../../domain/entities/input-data.entity";
import {PaymentInstallment} from "../../domain/entities/payment-installment.entity";
import {UserProfileService} from "../../../users/infrastructure/services/user-profile.service";
import {HistoryDto} from "../../domain/dto/history.dto";
import {Rate} from "../../domain/entities/rate.entity";

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
        const userProfile = await this.userProfileService.findOne(userId);

        const rate = this.rateRepository.create(inputData.rate);
        await this.rateRepository.save(rate);
        const input = this.inputDataRepository.create(inputData);
        input.rate = rate;
        await this.inputDataRepository.save(input);
        const paymentInstallments = this.paymentInstallmentRepository.create(this.generateFrenchAmortizationSchedule(input));
        await this.paymentInstallmentRepository.save(paymentInstallments);
        const payRun = this.payRunRepository.create();
        payRun.inputData = input;
        payRun.paymentInstallments = paymentInstallments;
        payRun.userProfile = userProfile;
        return await this.payRunRepository.save(payRun);
    }

    private generateFrenchAmortizationSchedule(inputData: InputData): PaymentInstallment[] {
        // TODO: Implement French Amortization Schedule correctly
        const paymentInstallments: PaymentInstallment[] = [];
        let initialBalance = inputData.vehicle_cost;
        const interestRate = 0.0125;
        const numberOfPayments = 24;
        const paymentAmount =
            (initialBalance * interestRate * Math.pow(1 + interestRate, numberOfPayments)) /
            (Math.pow(1 + interestRate, numberOfPayments) - 1);

        let interestAmount = initialBalance * interestRate;
        const amortization = paymentAmount - interestAmount;
        let outstandingBalance = initialBalance;

        for (let i = 1; i <= numberOfPayments; i++) {
            const payment = new PaymentInstallment(
                i,
                initialBalance,
                paymentAmount,
                interestAmount,
                amortization,
                0,
                outstandingBalance
            );
            paymentInstallments.push(payment);

            initialBalance = outstandingBalance;
            interestAmount = initialBalance * interestRate;
            outstandingBalance -= amortization;
        }
        return paymentInstallments;
    }

    async findDetail(id: number): Promise<PayRun> {
        const payRun = await this.payRunRepository.findOne({where: {id}, relations: ['inputData', 'paymentInstallments']});
        if (!payRun) {
            throw new NotFoundException(`The pay run with ID ${id} was not found.`);
        }
        return payRun;
    }
}