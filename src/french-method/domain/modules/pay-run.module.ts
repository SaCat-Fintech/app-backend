import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {InputData} from "../entities/input-data.entity";
import {PayRun} from "../entities/pay-run.entity";
import {PaymentInstallment} from "../entities/payment-installment.entity";
import {PayRunService} from "../../infrastructure/services/pay-run.service";
import {InputDataService} from "../../infrastructure/services/input-data.service";
import {PaymentInstallmentService} from "../../infrastructure/services/payment-installment.service";
import {PayRunController} from "../../interfaces/controllers/pay-run.controller";

@Module({
    imports: [TypeOrmModule.forFeature([InputData, PayRun, PaymentInstallment])],
    providers: [PayRunService, InputDataService, PaymentInstallmentService],
    controllers: [PayRunController],
    exports: [TypeOrmModule],
})
export class PayRunModule {
}