import { FrenchFee } from "src/french-fee/domain/entities/french-fee.entity";


// types

type CuotaType = {
    NC: number; // Número de cuota
    PG: string; // Periodo de gracia
    SICF: number; // Saldo Inicial Cuota Final
    ICF: number; // Interes Cuota Final
    ACF: number; // Amortización Cuota Final
    SegDesCF: number; // Seguro Desgravamen Cuota Final
    SFCF: number; // Saldo Final Cuota Final
    SI: number; // Saldo Inicial Cuota
    I: number; // Interes
    Cuota: number; // Cuota
    A: number; // Amortización
    SegDes: number; // Seguro Desgravamen Cuota
    SegRie: number; // Seguro de Riesgo
    GPS: number; // Gastos de Portes y Seguros
    Portes: number; // Portes
    GasAdm: number; // Gastos Administrativos
    SF: number; // Saldo Final para Cuota
    Flujo: number; // Flujo
}


// classes

class ResultadosFinanciamiento {
    TEA: number;
    TEM: number;
    NCxA: number;
    N: number;
    CI: number;
    CF: number;
    Prestamo: number;
    Saldo: number;
    frenchFee: FrenchFee;

    constructor (frenchFee: FrenchFee) {
        this.frenchFee = frenchFee;
        this.TEA = this.calculateTEA();
        this.TEM = this.calculateTEM(this.TEA);
        this.NCxA = frenchFee.NDxA / frenchFee.frec; // Número de cuotas por año
        this.N = +frenchFee.Plan.split(" ")[1]; // Número de cuotas
        this.CI = frenchFee.pCI*frenchFee.PV; // Cuota inicial
        this.CF = frenchFee.pCF*frenchFee.PV; // Cuota final
        this.Prestamo = this.calculatePrestamo(this.CI); // Préstamo
        this.Saldo = this.Prestamo - this.CF / Math.pow((1 + this.TEM + frenchFee.pSegDes), (this.N + 1)); // Saldo a financiar con cuotas
    }

    calculateTEA(): number {
        let result: number;
        let divisor: number;

        let { Tasa, NDxA, tpTasa, PC } = this.frenchFee;

        if (PC === "Diaria") {
            divisor = 1;
        } else if (PC === "Mensual") {
            divisor = 30;
        } else {
            throw new Error("Invalid value for PC. Expected 'Diaria' or 'Mensual'.");
        }

        if (tpTasa === "TNA") {
            result = Math.pow((1 + Tasa / (NDxA / divisor)), (NDxA / divisor)) - 1;
        } else {
            result = Tasa;
        }

        return result;
    }

    calculateTEM(TEA: number): number {
        let { frec, NDxA } = this.frenchFee;
        return Math.pow((1 + TEA), (frec / NDxA)) - 1;
    }

    calculatePrestamo(CI: number): number {
        let { PV, costesNotariales, costesRegistrales, tasacion, comisionEstudio, comisionActivacion } = this.frenchFee;
        return PV - CI + costesNotariales + costesRegistrales + tasacion + comisionEstudio + comisionActivacion;
    }
}

class ResultadosGastosPeriodicos {
    pSegDesPer: number;
    SegRiePer: number;

    constructor (NCxA:number, frenchFee: FrenchFee) {
        this.pSegDesPer = frenchFee.frec * frenchFee.pSegDes / 30; // Porcentaje de seguro desgravamen
        this.SegRiePer = frenchFee.pSegRie * frenchFee.PV / NCxA; // Seguro de riesgo
    }
}

const getCuotas = (
    frenchFee: FrenchFee,
    resultadosFinanciamiento: ResultadosFinanciamiento,
    resultadosGastosPeriodicos: ResultadosGastosPeriodicos
) : CuotaType[]=> {
    
    let { PV, Plan, pCI, pCF, NA, Tasa, tpTasa, PC, frec, NDxA } = frenchFee;

    let cuotaArray: CuotaType[] = [];
    let cantPlazoGraciaTotal = 3;
    let cantPlazoGraciaParcial = 3;

    const { Prestamo } = resultadosFinanciamiento;

    for (let i = 1; i <= resultadosFinanciamiento.N + 1; i++) {
        let cuota: CuotaType = { NC: i, PG: 'S'} as CuotaType;
        
        if (--cantPlazoGraciaParcial) cuota.PG = 'T';
        if (--cantPlazoGraciaTotal) cuota.PG = 'P';

        if (i === 1) cuota.SICF = 

        cuotaArray.push(cuota);
    }
    return cuotaArray;
}

class ResultadosTotales {
    intereses: string;
    amortizacionCapital: string;
    seguroDesgravamen: string;
    seguroRiesgo: string;
    GPS: string;
    Portes: string;
    GasAdm: string;

    constructor (cuotas: any) {}
}
class ResultadosIndicadoresRentabilidad {
    COKi: number;
    TIR: number;
    TCEA: number;
    VAN: number;

    constructor (frenchFee: FrenchFee, Prestamo: number, resultadosTotales: ResultadosTotales) {
        this.COKi = Math.pow(1+frenchFee.COK,frenchFee.frec/frenchFee.NDxA)-1; // Costo de oportunidad de capital
        this.TIR = this.calculateTIR(resultadosTotales);
        this.TCEA = Math.pow(1+this.TIR,frenchFee.NDxA/frenchFee.frec)-1; // Tasa de costo efectivo anual
        this.VAN = Prestamo + this.NPV(this.COKi, resultadosTotales);
        
    }

    calculateTIR(resultadosTotales: ResultadosTotales) {
        return 0;
    }

    NPV(COKi: number, resultadosTotales: ResultadosTotales) {
        return 0;
    }
}



export const getFrenchFeeResults = async (frenchFee: FrenchFee) => {

    const resultadosFinanciamiento = new ResultadosFinanciamiento(frenchFee);

    delete resultadosFinanciamiento.frenchFee;

    const resultadosGastosPeriodicos = new ResultadosGastosPeriodicos(resultadosFinanciamiento.NCxA, frenchFee);

    const cuotas = getCuotas(frenchFee, resultadosFinanciamiento, resultadosGastosPeriodicos);

    const resultadosTotales = new ResultadosTotales(cuotas);

    const resultadosIndicadoresRentabilidad = new ResultadosIndicadoresRentabilidad(frenchFee,resultadosFinanciamiento.Prestamo, resultadosTotales);
    
    console.log({
        resultadosFinanciamiento,
        resultadosGastosPeriodicos,
        cuotas,
        resultadosTotales,
        resultadosIndicadoresRentabilidad
    })

    return {
        resultadosFinanciamiento,
        resultadosGastosPeriodicos,
        cuotas,
        resultadosTotales,
        resultadosIndicadoresRentabilidad
    }
}