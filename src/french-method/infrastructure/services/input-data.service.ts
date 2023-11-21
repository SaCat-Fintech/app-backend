import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {InputData} from "../../domain/entities/input-data.entity";
import {Repository} from "typeorm";

@Injectable()
export class InputDataService {
    constructor(
        @InjectRepository(InputData)
        private readonly inputDataRepository: Repository<InputData>,
    ) {}
    async findAll(): Promise<InputData[]> {
        return await this.inputDataRepository.find();
    }
    async findOne(id: number): Promise<InputData> {
        const inputData = await this.inputDataRepository.findOne({where: {id}});
        if (!inputData) {
            throw new NotFoundException(`The input data with ID ${id} was not found.`);
        }
        return inputData;
    }
    async create(newInputData: InputData): Promise<InputData> {
        return await this.inputDataRepository.save(newInputData);
    }
}