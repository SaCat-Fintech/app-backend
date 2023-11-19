import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class CreateFullUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    dni: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    birthdate: Date;

    //@ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    //@ApiProperty({ type: () => [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    role_ids: number[];
}

export class UpdateFullUserDto extends OmitType(CreateFullUserDto, ['user_id'] as const) {}