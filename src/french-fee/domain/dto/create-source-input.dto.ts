import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export enum GracePeriodEnum {
    TOTAL = "TOTAL",
    PARTIAL = "PARTIAL",
    NONE = "NONE"
}

export enum PeriodEnum {
    ANNUAL = "ANNUAL",
    SEMESTER = "SEMESTER",
    QUATRIMESTERLY = "QUATRIMESTERLY",
    QUARTERLY = "QUARTERLY",
    BIMONTHLY = "BIMONTHLY",
    MONTHLY = "MONTHLY",
    FORTNIGHTLY = "FORTNIGHTLY",
    DIARY = "DIARY"
}

export enum RateTypeEnum {
    EFFECTIVE="EFFECTIVE",
    NOMINAL="NOMINAL"
}

export enum CurrencyEnum {
    PEN="PEN",
    USD="USD"
}

export class CreateSourceInputDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(CurrencyEnum)
    currency: CurrencyEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    vehicle_cost: number; //PV

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1)
    initial_payment_percentage: number; //pCI

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1)
    financing_percentage: number;

    // Rate Class

    @ApiProperty()
    @IsEnum(PeriodEnum)
    capitalization?: PeriodEnum //RATE-PC
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(RateTypeEnum)
    rate_type: RateTypeEnum; //RATE-tpTasa

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(PeriodEnum)
    rate_period: PeriodEnum

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    rate_value: number; //RATE-Tasa

    //----------------------
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    payment_frequency: number; //frec

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    fees_ammount: number; //Plan  (validar 24 o 36)

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    COK: number; //COK

    // Grace Period Class
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(GracePeriodEnum)
    period_type: GracePeriodEnum; //GRACE-tpPeriodo

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(3)
    period_value: number; //GRACE-Periodo

    @ApiProperty()
    @IsNumber()
    @Min(0)
    first_fee?: number; //GRACE-PrimeraCuota

    @ApiProperty()
    @IsNumber()
    @Min(0)
    second_fee?: number; //GRACE-SegundaCuota

    @ApiProperty()
    @IsNumber()
    @Min(0)
    third_fee?: number; //GRACE-TerceraCuota
}