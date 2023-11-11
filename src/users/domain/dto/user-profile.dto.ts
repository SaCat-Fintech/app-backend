import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, OmitType } from "@nestjs/swagger";

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
    phone_number: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    role: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}

export class UpdateUserProfileDto extends OmitType(CreateUserProfileDto, ['user_id'] as const) {}