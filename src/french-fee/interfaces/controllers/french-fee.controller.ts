import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFrenchFeeDto } from '../../domain/dto/create-french-fee.dto';
import { FrenchFee } from '../../domain/entities/french-fee.entity';
import { FrenchFeeService } from '../../infrastructure/services/french-fee.service';

@ApiTags('french-fees')
@Controller('french-fees')
export class FrenchFeeController {
    constructor(private readonly frenchFeeService: FrenchFeeService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new French fee' })
    @ApiBody({ type: CreateFrenchFeeDto })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: FrenchFee })
    async create(@Body() createFrenchFeeDto: CreateFrenchFeeDto): Promise<FrenchFee> {
        return this.frenchFeeService.create(createFrenchFeeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all French fees' })
    @ApiResponse({ status: 200, description: 'List of French fees', type: [FrenchFee] })
    async findAll(): Promise<FrenchFee[]> {
        return this.frenchFeeService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a single French fee by ID' })
    @ApiResponse({ status: 200, description: 'Details of the French fee', type: FrenchFee })
    @ApiResponse({ status: 404, description: 'French fee not found' })
    async findOne(@Param('id') id: number): Promise<FrenchFee> {
        try {
            return await this.frenchFeeService.findOne(id);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new NotFoundException(`The FrenchFee with ID ${id} was not found.`);
        }
    }

    @Get(':id/results')
    @ApiOperation({ summary: 'Retrieve a single French fee by ID' })
    @ApiResponse({ status: 200, description: 'Results of the French fee', type: FrenchFee })
    @ApiResponse({ status: 404, description: 'French fee not found' })
    async getOneResults(@Param('id') id: number): Promise<FrenchFee> {
        try {
            return await this.frenchFeeService.getResults(id);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new NotFoundException(`The FrenchFee with ID ${id} was not found.`);
        }
    }
}
