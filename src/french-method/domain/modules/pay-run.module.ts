import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileModule } from "../../../users/domain/modules/user-profile.module";
import { UserProfileService } from "../../../users/infrastructure/services/user-profile.service";
import { InputDataService } from "../../infrastructure/services/input-data.service";
import { PayRunService } from "../../infrastructure/services/pay-run.service";
import { PaymentInstallmentService } from "../../infrastructure/services/payment-installment.service";
import { PayRunController } from "../../interfaces/controllers/pay-run.controller";
import { FinancingResult } from "../entities/financing-results.entity";
import { GracePeriod } from "../entities/grace-period.entity";
import { InputData } from "../entities/input-data.entity";
import { PayRun } from "../entities/pay-run.entity";
import { PaymentInstallment } from "../entities/payment-installment.entity";
import { ProfitabilityIndicator } from "../entities/profitability-indicator.entity";
import { Rate } from "../entities/rate.entity";

@Module({
    imports: [TypeOrmModule.forFeature([InputData, PayRun, PaymentInstallment, ProfitabilityIndicator, Rate, GracePeriod, FinancingResult]), UserProfileModule],
    providers: [PayRunService, InputDataService, PaymentInstallmentService, UserProfileService],
    controllers: [PayRunController],
    exports: [TypeOrmModule],
})
export class PayRunModule {
}