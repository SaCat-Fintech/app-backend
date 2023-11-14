import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserProfile } from 'src/users/domain/entities/user-profile.entity';

@Entity()
export class FrenchFee {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of the fee' })
    id: number;

    @Column('float')
    @ApiProperty({ description: 'Precio de Venta del Activo' })
    PV: number;

    @Column()
    @ApiProperty({ description: 'Tipo de plan de pagos' })
    Plan: string;

    @Column('float')
    @ApiProperty({ description: '% Cuota Inicial' })
    pCI: number;

    @Column('float')
    @ApiProperty({ description: '% Cuota final' })
    pCF: number;

    @Column('int')
    @ApiProperty({ description: 'Número de Años' })
    NA: number;

    @Column('float')
    @ApiProperty({ description: 'Tasa de interés' })
    Tasa: number;

    @Column()
    @ApiProperty({ description: 'Tipo de tasa de interés' })
    tpTasa: string;

    @Column()
    @ApiProperty({ description: 'Periodo de capitalización' })
    PC: string;

    @Column('int')
    @ApiProperty({ description: 'Frecuencia de pago' })
    frec: number;

    @Column('int')
    @ApiProperty({ description: 'Número de días por año' })
    NDxA: number;

    // Columns for gastosIniciales
    @Column('float')
    @ApiProperty({ description: 'Costes Notariales' })
    costesNotariales: number;

    @Column('float')
    @ApiProperty({ description: 'Costes Registrales' })
    costesRegistrales: number;

    @Column('float')
    @ApiProperty({ description: 'Tasación' })
    tasacion: number;

    @Column('float')
    @ApiProperty({ description: 'Comisión de estudio' })
    comisionEstudio: number;

    @Column('float')
    @ApiProperty({ description: 'Comisión activación' })
    comisionActivacion: number;

    // Columns for gastosPeriodicos
    @Column('float')
    @ApiProperty({ description: 'GPS' })
    GPSPer: number;

    @Column('float')
    @ApiProperty({ description: 'Portes' })
    PortesPer: number;

    @Column('float')
    @ApiProperty({ description: 'Gastos de Administración' })
    GasAdmPer: number;

    @Column('float')
    @ApiProperty({ description: 'Porcentaje Seguro Desgravamen' })
    pSegDes: number;

    @Column('float')
    @ApiProperty({ description: 'Porcentaje Seguro de Riesgo' })
    pSegRie: number;

    // Column for costoOportunidad
    @Column('float')
    @ApiProperty({ description: 'Costo de Oportunidad del Capital' })
    COK: number;

    @ManyToOne(() => UserProfile, userProfile => userProfile.frenchFees)
    @ApiProperty({ type: () => UserProfile })
    userProfile: UserProfile;
}
