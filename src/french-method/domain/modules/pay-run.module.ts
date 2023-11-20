import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {InputData} from "../entities/input-data.entity";
import {PayRun} from "../entities/pay-run.entity";
import {PaymentInstallment} from "../entities/payment-installment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([InputData, PayRun, PaymentInstallment])],
    providers: [],
    controllers: [],
    exports: [TypeOrmModule],
})
export class PayRunModule {
}