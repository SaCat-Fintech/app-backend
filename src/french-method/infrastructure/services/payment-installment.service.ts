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
}