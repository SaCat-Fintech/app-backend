import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty} from "@nestjs/swagger";
import { PartialType } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
}


export class UpdateRoleDto extends PartialType(CreateRoleDto) {}