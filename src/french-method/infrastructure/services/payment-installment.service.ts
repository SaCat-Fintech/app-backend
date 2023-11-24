import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PaymentInstallment} from "../../domain/entities/payment-installment.entity";
import {Repository} from "typeorm";

@Injectable()
export class PaymentInstallmentService {
    constructor(
        @InjectRepository(PaymentInstallment)
        private readonly paymentInstallmentRepository: Repository<PaymentInstallment>,
    ) {}
    async findAll(): Promise<PaymentInstallment[]> {
        return await this.paymentInstallmentRepository.find();
    }
    async findByPayRunId(payRunId: number): Promise<PaymentInstallment[]> {
        return await this.paymentInstallmentRepository.find({ where: { payRun: { id: payRunId } } });
    }

    async create(paymentInstallment: PaymentInstallment): Promise<PaymentInstallment> {
        return await this.paymentInstallmentRepository.save(paymentInstallment);
    }

    async instance(): Promise<PaymentInstallment> {
        return this.paymentInstallmentRepository.create();
    }
    async saveMuch(paymentInstallments: PaymentInstallment[]): Promise<PaymentInstallment[]> {
        return await this.paymentInstallmentRepository.save(paymentInstallments);
    }

}