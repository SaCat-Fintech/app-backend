import {IsDate, IsNotEmpty, IsNumber} from "class-validator";
import {PartialType} from "@nestjs/swagger";

export class CreatePayRunDto {
    @IsNotEmpty()
    @IsDate()
    created_at: Date;
    @IsNotEmpty()
    @IsDate()
    updated_at: Date;
    @IsNotEmpty()
    @IsNumber()
    input_data_id: number;
    //user_profile_id: number;
}

export class UpdatePayRunDto extends PartialType(CreatePayRunDto) {}