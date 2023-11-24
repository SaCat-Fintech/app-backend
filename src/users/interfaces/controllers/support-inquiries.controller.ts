import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {SupportInquiriesService} from "../../infrastructure/services/support-inquiries.service";
import {SupportInquiries} from "../../domain/entities/support-inquiries.entity";

@ApiTags('support-inquiries')
@Controller('support-inquiries')
export class SupportInquiriesController {
    constructor(private readonly supportInquiriesService: SupportInquiriesService) {}
    @ApiBearerAuth()
    @Get(':id')
    @ApiResponse({ status: 200, type: SupportInquiries, description: 'Get all support inquiries.'})
    async findOne(@Param('id') id: number): Promise<SupportInquiries> {
        return await this.supportInquiriesService.findOne(id);
    }

    @Post('')
    @ApiResponse({ status: 201, type: SupportInquiries, description: 'Create support inquiry.'})
    async createSupportInquiry(@Body() supportInquiry: SupportInquiries): Promise<SupportInquiries> {
        return await this.supportInquiriesService.create(supportInquiry);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Delete support inquiry.'})
    async deleteSupportInquiry(@Param('id') id: number): Promise<void> {
        return await this.supportInquiriesService.delete(id);
    }
    
}