import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {PayRunService} from "../../infrastructure/services/pay-run.service";
import {PayRun} from "../../domain/entities/pay-run.entity";
import {InputData} from "../../domain/entities/input-data.entity";
import {PaymentInstallmentService} from "../../infrastructure/services/payment-installment.service";
import {HistoryDto} from "../../domain/dto/history.dto";

@ApiTags('pay-run')
@Controller('session')
export class PayRunController {
    constructor(
        private readonly payRunService: PayRunService,
        private readonly paymentInstallmentService: PaymentInstallmentService,
        ) {}

    @Get()
    async findAll(): Promise<any> {
        return await this.payRunService.findAll();
    }

    @Get(':id')
    @ApiResponse({status: 200, description: 'Get pay run by id.'})
    async findOne(@Param('id') id: number): Promise<PayRun> {
        return await this.payRunService.findOne(id);
    }



    @Get(':id/payment-installments')
    @ApiResponse({status: 200, description: 'Get payment installments by pay run id.'})
    async getPaymentInstallmentsByPayRunId(@Param('id') id: number): Promise<any> {
        return await this.paymentInstallmentService.findByPayRunId(id);
    }

    @Post('operation/:userId')
    @ApiResponse({status: 201, description: 'Create pay run.'})
    async createPayRun(@Param('userId') userId: number, @Body() inputData: InputData): Promise<PayRun> {
        return await this.payRunService.createPayRunWithInstallments(inputData, userId);
    }

    @Get('history/:userId')
    @ApiResponse({status: 200, description: 'Get pay run history.'})
    async getPayRunHistory(@Param('userId') userId: number): Promise<HistoryDto[]> {
        return await this.payRunService.findByUserProfileId(userId);
    }
}