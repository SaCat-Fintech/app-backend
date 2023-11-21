import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {InputData} from "../../domain/entities/input-data.entity";
import {Repository} from "typeorm";
import {GracePeriod} from "../../domain/entities/grace-period.entity";

@Injectable()
export class InputDataService {
    constructor(
        @InjectRepository(InputData)
        private readonly inputDataRepository: Repository<InputData>,
        //private readonly gracePeriodRepository: Repository<GracePeriod>,
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
        /*
        const gracePeriods = this.gracePeriodRepository.create();
        await this.gracePeriodRepository.save(gracePeriods);

        const input = this.inputDataRepository.create(newInputData);
        await this.inputDataRepository.save(input);
         */
        return await this.inputDataRepository.save(newInputData);
    }
}