import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./configuration/TypeOrmConfigService";
import { AuthModule } from './auth/domain/modules/auth.module';
import { PayRunModule } from "./french-method/domain/modules/pay-run.module";
import { SupportInquiryModule } from "./users/domain/modules/support-inquiries.module";

@Module({
  imports: [AuthModule, PayRunModule, SupportInquiryModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
