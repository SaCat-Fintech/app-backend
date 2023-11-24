import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportInquiries } from "../entities/support-inquiries.entity";
import { SupportInquiriesService } from "../../infrastructure/services/support-inquiries.service";
import { SupportInquiriesController } from "../../interfaces/controllers/support-inquiries.controller";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { FirebaseAuthMiddleware } from "../../../middleware/firebase.auth.middleware";


@Module({
    imports: [TypeOrmModule.forFeature([SupportInquiries])],
    providers: [SupportInquiriesService],
    controllers: [SupportInquiriesController],
    exports: [TypeOrmModule, SupportInquiriesService],
})
export class SupportInquiryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(FirebaseAuthMiddleware)
            .exclude({path: 'support-inquiries', method: RequestMethod.POST})
            .forRoutes(SupportInquiriesController);
    }
}