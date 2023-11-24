import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import {User} from "../entities/user.entity";

export class CreateUserProfileDto {
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

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiProperty({ type: () => [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    role_ids: number[];
}

export class UpdateUserProfileDto extends OmitType(CreateUserProfileDto, ['user_id'] as const) {}