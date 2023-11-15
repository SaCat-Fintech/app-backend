import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}