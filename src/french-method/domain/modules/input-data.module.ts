import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {InputData} from "../entities/input-data.entity";
import {InputDataService} from "../../infrastructure/services/input-data.service";
import {InputDataController} from "../../interfaces/controllers/input-data.controller";

@Module({
    imports: [TypeOrmModule.forFeature([InputData])],
    providers: [InputDataService],
    controllers: [InputDataController],
    exports: [TypeOrmModule],
})
export class InputDataModule {
}