import {Controller, Get, Param} from "@nestjs/common";
import {InputDataService} from "../../infrastructure/services/input-data.service";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {InputData} from "../../domain/entities/input-data.entity";

@ApiTags('input-data')
@Controller('input-data')
export class InputDataController {
    constructor(private readonly inputDataService: InputDataService) {}

    @Get(':id')
    @ApiResponse({status: 200, type: InputData, description: 'Get input data by id.'})
    async findOne(@Param('id') id: number): Promise<InputData> {
        return await this.inputDataService.findOne(id);
    }

}