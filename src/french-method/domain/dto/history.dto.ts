import { ApiProperty } from "@nestjs/swagger";

export class HistoryDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    vehicle_cost: number;
    @ApiProperty()
    currency: string;
    @ApiProperty()
    payment_frequency: string;
}