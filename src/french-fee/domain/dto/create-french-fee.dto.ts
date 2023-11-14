import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export enum PaymentPlan { // Tipo de plan de pagos
    Plan36 = "Plan 36",
    // Add other plans as needed
}

export enum InterestRateType {
    TNA = "TNA",
    // Add other types as needed
}

export enum CapitalizationPeriod {
    Daily = "Diaria",
    Monthly = "Mensual",
    // Add other periods as needed
}

export class CreateFrenchFeeDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    PV: number; // Precio de Venta del Activo

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(PaymentPlan)
    Plan: PaymentPlan;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1)
    pCI: number; // % Cuota Inicial

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1)
    pCF: number; // % Cuota final

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    NA: number; // Nº de Años

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    Tasa: number; // Tasa de interés

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(InterestRateType)
    tpTasa: InterestRateType; // Tipo de tasa de interés

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(CapitalizationPeriod)
    PC: CapitalizationPeriod; // Periodo de capitalización

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    frec: number; // Frecuencia de pago

    @ApiProperty()
    @IsNumber()
    @Min(1)
    NDxA: number; // Nº de días por año

    // Gastos Iniciales

    @ApiProperty()
    @IsNumber()
    costesNotariales: number;

    @ApiProperty()
    @IsNumber()
    costesRegistrales: number;

    @ApiProperty()
    @IsNumber()
    tasacion: number;

    @ApiProperty()
    @IsNumber()
    comisionEstudio: number;

    @ApiProperty()
    @IsNumber()
    comisionActivacion: number;

    // Gastos Periódicos

    @ApiProperty()
    @IsNumber()
    GPSPer: number; // GPS

    @ApiProperty()
    @IsNumber()
    PortesPer: number; // Portes

    @ApiProperty()
    @IsNumber()
    GasAdmPer: number; // Gastos Administrativos

    @ApiProperty()
    @IsNumber()
    pSegDes: number; // % Seguro Desgravamen

    @ApiProperty()
    @IsNumber()
    pSegRie: number; // % Seguro de Riesgo

    @ApiProperty()
    @IsNumber()
    COK: number; // Costo de oportunidad de capital


    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'ID of the associated UserProfile' })
    userId: number;
}