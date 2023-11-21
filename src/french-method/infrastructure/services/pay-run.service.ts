import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PayRun} from "../../domain/entities/pay-run.entity";
import {Repository} from "typeorm";
import {PaymentInstallmentService} from "./payment-installment.service";
import {InputData} from "../../domain/entities/input-data.entity";
import {PaymentInstallment} from "../../domain/entities/payment-installment.entity";
import {CreatePaymentInstallmentDto} from "../../domain/dto/payment-installment.dto";
import {InputDataService} from "./input-data.service";

@Injectable()
export class PayRunService {
    constructor(
        @InjectRepository(PayRun)
        private readonly payRunRepository: Repository<PayRun>,
        private readonly paymentInstallmentService: PaymentInstallmentService,
        private readonly inputDataService: InputDataService,
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

    async createPayRunWithInstallments(inputData: InputData): Promise<PayRun> {
        const inputDataSource = await this.inputDataService.create(inputData);
        const payRun = this.payRunRepository.create();
        payRun.inputData = inputDataSource;
        //this.generateFrenchAmortizationSchedule(inputData);
        return await this.payRunRepository.save(payRun);
    }

    private generateFrenchAmortizationSchedule(inputData: InputData): void {
        let paymentInstallments : PaymentInstallment[] = [];
        let initialBalance = inputData.vehicle_cost;
        const interestRate = 0.0125;
        const numberOfPayments = 24;
        const paymentAmount = initialBalance * (interestRate * Math.pow(1 + interestRate, numberOfPayments)) / (Math.pow(1 + interestRate, numberOfPayments) - 1);
        let interestAmount = initialBalance * interestRate;
        const amortization = paymentAmount - interestAmount;
        let outstandingBalance = initialBalance - amortization;
        for (let i = 1; i <= numberOfPayments; i++) {
            let paymentInstallment: PaymentInstallment;
            paymentInstallment = new PaymentInstallment(
                i,
                initialBalance,
                paymentAmount,
                interestAmount,
                amortization,
                50,
                outstandingBalance,
            );
            paymentInstallments.push(paymentInstallment);
            initialBalance = outstandingBalance;
            interestAmount = initialBalance * interestRate;
            outstandingBalance = initialBalance - amortization;
        }
        this.paymentInstallmentService.saveMuch(paymentInstallments);
    }
}