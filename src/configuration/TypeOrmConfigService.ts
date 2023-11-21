import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { FrenchFee } from "src/french-fee/domain/entities/french-fee.entity";
import { Role } from "../users/domain/entities/role.entity";
import { UserProfile } from "../users/domain/entities/user-profile.entity";
import { User } from "../users/domain/entities/user.entity";
import {InputData} from "../french-method/domain/entities/input-data.entity";
import {PaymentInstallment} from "../french-method/domain/entities/payment-installment.entity";
import {PayRun} from "../french-method/domain/entities/pay-run.entity";
import {Rate} from "../french-method/domain/entities/rate.entity";
import {GracePeriod} from "../french-method/domain/entities/grace-period.entity";

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
            entities: [Role, User, UserProfile, FrenchFee, InputData, PayRun, PaymentInstallment, Rate, GracePeriod],
            synchronize: true,
        }
    }
}