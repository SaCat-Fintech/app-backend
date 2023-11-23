import {Injectable, NotFoundException} from "@nestjs/common";
import {SupportInquiries} from "../../domain/entities/support-inquiries.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class SupportInquiriesService {
    constructor(
        @InjectRepository(SupportInquiries)
        private readonly supportInquiriesRepository: Repository<SupportInquiries>,
    ) {}
    async findOne(id: number): Promise<SupportInquiries> {
        const supportInquiry = await this.supportInquiriesRepository.findOne({where: {id}});
        if (!supportInquiry) {
            throw new NotFoundException(`The support inquiry with ID ${id} was not found.`);
        }
        return supportInquiry;
    }
    async create(newSupportInquiries: SupportInquiries): Promise<SupportInquiries> {
        return await this.supportInquiriesRepository.save(newSupportInquiries);
    }
    async delete(id: number): Promise<void> {
        const supportInquiry = await this.supportInquiriesRepository.findOne({where: {id}});
        if (!supportInquiry) {
            throw new NotFoundException(`The support inquiry with ID ${id} was not found.`);
        }
        await this.supportInquiriesRepository.delete(id);
    }
}