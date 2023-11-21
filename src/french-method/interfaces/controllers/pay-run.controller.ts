import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {PayRunService} from "../../infrastructure/services/pay-run.service";
import {PayRun} from "../../domain/entities/pay-run.entity";
import {InputData} from "../../domain/entities/input-data.entity";

@ApiTags('pay-run')
@Controller('pay-runs')
export class PayRunController {
    constructor(private readonly payRunService: PayRunService) {}

    @Get()
    async findAll(): Promise<any> {
        return await this.payRunService.findAll();
    }

    @Get(':id')
    @ApiResponse({status: 200, description: 'Get pay run by id.'})
    async findOne(@Param('id') id: number): Promise<PayRun> {
        return await this.payRunService.findOne(id);
    }

    @Post()
    @ApiResponse({status: 201, description: 'Create pay run.'})
    async createPayRun(@Body() inputData: InputData): Promise<PayRun> {
        return await this.payRunService.createPayRunWithInstallments(inputData);
    }

}