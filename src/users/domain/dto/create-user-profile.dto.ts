import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateUserProfileDto {
    @IsNotEmpty()
    @IsString()
    dni: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    role: string;
    
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}