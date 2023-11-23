import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { FinancingResult } from "src/french-method/domain/entities/financing-results.entity";
import { ProfitabilityIndicator } from "src/french-method/domain/entities/profitability-indicator.entity";
import { GracePeriod } from "../french-method/domain/entities/grace-period.entity";
import { InputData } from "../french-method/domain/entities/input-data.entity";
import { PayRun } from "../french-method/domain/entities/pay-run.entity";
import { PaymentInstallment } from "../french-method/domain/entities/payment-installment.entity";
import { Rate } from "../french-method/domain/entities/rate.entity";
import { Role } from "../users/domain/entities/role.entity";
import { UserProfile } from "../users/domain/entities/user-profile.entity";
import { User } from "../users/domain/entities/user.entity";
import {SupportInquiries} from "../users/domain/entities/support-inquiries.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('POSTGRES_USER'),
            password: this.configService.get<string>('POSTGRES_PASSWORD'),
            database: this.configService.get<string>('POSTGRES_DB'),
            entities: [Role, User, UserProfile, InputData, PayRun, PaymentInstallment, ProfitabilityIndicator, Rate, GracePeriod, FinancingResult, SupportInquiries],
            synchronize: true,
        }
    }
}