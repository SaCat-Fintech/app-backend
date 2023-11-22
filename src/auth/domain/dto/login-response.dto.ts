import { ApiProperty } from "@nestjs/swagger";
import { UserProfile } from "../../../users/domain/entities/user-profile.entity";

export class LoginResponseDto {
    @ApiProperty()
    user_profile_id: number;
    @ApiProperty()
    jwt_token: string;
    @ApiProperty()
    full_name: string;

    constructor(jwt_token: string, user: UserProfile) {
        this.user_profile_id = user.id;
        this.jwt_token = jwt_token;

        const names = user.first_name.split(' ');
        this.full_name = names[0];

        const lastNames = user.last_name.split(' ');
        this.full_name += ' ' + lastNames[0];
    }
}