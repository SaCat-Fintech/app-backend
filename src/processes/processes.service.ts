import { Injectable } from '@nestjs/common';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';

// 1

function calculateTEA(tpTasa: string, Tasa: number, NDxA: number, pc: string): number {
  let result: number;
  let divisor: number;

  if (pc === "Diaria") {
    divisor = 1;
  } else if (pc === "Mensual") {
    divisor = 30;
  } else {
    throw new Error("Invalid value for pc. Expected 'Diaria' or 'Mensual'.");
  }

  if (tpTasa === "TNA") {
    result = Math.pow((1 + Tasa / (NDxA / divisor)), (NDxA / divisor)) - 1;
  } else {
    result = Tasa;
  }

  return result;
}

function calculateTEM(TEA: number, frec: number, NDxA: number): number {
  return Math.pow((1 + TEA), (frec / NDxA)) - 1;
}

function calculateCuotasAnio(frec: number, NDxA: number): number {
  return NDxA / frec;
}

function calculateTotalCuotas(planType: string): number {
  let res = planType.split(" ");
  return +res[1];
}

function calculateCuota(price: number, fee: number): number {
  return price * fee;
}

function calculateMontoPrestamo(price: number, initialFee: number, expenses: any): number {
  let expensesAmmount = Object.values(expenses).reduce((a:number, b:number) => a + b, 0);
  return price - initialFee + (+expensesAmmount);
}

function calculateSaldoFinanciar(Prestamo: number, CF: number, TEM: number, pSegDes: number, N: number): number {
  return Prestamo - CF / Math.pow((1 + TEM + pSegDes), (N + 1));
}

// 2

function calculateSeguroDesgravPer(pSegDes:number, frec: number): number {
  return pSegDes * frec/30;
}

function calculateSeguroRiesgo(pSegRie: number, price: number, annualFees: number): number {
  console.log('t',annualFees)
  return pSegRie * price / annualFees;
}

// 3

type FinancingResultsType = {
  TEA: number,
  TEM: number,
  cuotasAnio: number,
  totalCuotas: number,
  cuotaInicial: number,
  cuotaFinal: number,
  montoPrestamo: number,
  saldoFinanciarCoutas: number
}

type PeriodicExpensesResultsType = {
  seguroDesgravPer: number,
  seguroRiesgo: number
}

type PaymentPlanPeriodType = {
  'Saldo Inicial / Cuota Final': number,
  'Intereses / Cuota Final': number,
  'Amortización / Cuota Final': number,
  'Seguro Desgravamen / Cuota Final': number,
  'Saldo Final / Cuota Final': number,
  'Saldo Inicial / Cuota': number,
  'Intereses': number,
  'Cuota (Inc Seg Des)': number,
  'Amortización': number,
  'Seguro Desgravamen / Cuota': number,
  'Seguro Riesgo': number,
  'GPS': number,
  'Portes': number,
  'Gastos Administrativos': number,
  'Saldo Final para Cuota': number,
  'Flujo': number
}

function calculatePaymentPlan(
  data: CreateProcessDto,
  financingResults: FinancingResultsType,
  periodicExpensesResults: PeriodicExpensesResultsType
) {

  let pgValues;

  let saldoFinalCF = 0;

  for (let i = 1; i <= financingResults.totalCuotas; i++) {
    let PG = '';
    if (i>=1 && i<=3) PG = "T";
    else if (i>=4 && i<=6) PG = "P";
    else PG = "S";


    let SICF = 0;
    if (i===1) SICF = financingResults.saldoFinanciarCoutas;
  }

  let SICF = financingResults.cuotaFinal / Math.pow((1 + financingResults.TEM + periodicExpensesResults.seguroDesgravPer), financingResults.cuotasAnio+1);
  let ICF = SICF * financingResults.TEM;
  let ACF = 0;
  let SegDesCF = SICF * periodicExpensesResults.seguroDesgravPer;
  let SFCF
  let SI
  let I
  let Cuota
  let A
  let SegDes
  let SegRie
  let GPS
  let Portes
  let GasAdm
  let SF
  let Flujo
  let results: PaymentPlanPeriodType[] = [];

  results.push({
    'Saldo Inicial / Cuota Final': SICF,
    'Intereses / Cuota Final': ICF,
    'Amortización / Cuota Final': ACF,
    'Seguro Desgravamen / Cuota Final': SegDesCF,
    'Saldo Final / Cuota Final': SFCF,
    'Saldo Inicial / Cuota': SI,
    'Intereses': I,
    'Cuota (Inc Seg Des)': Cuota,
    'Amortización': A,
    'Seguro Desgravamen / Cuota': SegDes,
    'Seguro Riesgo': SegRie,
    'GPS': GPS,
    'Portes': Portes,
    'Gastos Administrativos': GasAdm,
    'Saldo Final para Cuota': SF,
    'Flujo': Flujo
  });

  return results;
}

// 4

function calculateTasaDescuento(COK: number, frec: number, daysPerYear: number): number {
  return Math.pow((1+COK),(frec/daysPerYear))-1;
}



@Injectable()
export class ProcessesService {
  create(createProcessDto: CreateProcessDto) {

    // Financiamiento

    let TEA = calculateTEA(
      createProcessDto.loanData.interestRateType,
      createProcessDto.loanData.interestRate,
      createProcessDto.loanData.daysPerYear,
      createProcessDto.loanData.capitalizationPeriod
    )

    let TEM = calculateTEM(
      TEA,
      createProcessDto.loanData.paymentFrequency,
      createProcessDto.loanData.daysPerYear
    )

    let cuotasAnio = calculateCuotasAnio(
      createProcessDto.loanData.paymentFrequency,
      createProcessDto.loanData.daysPerYear
    )

    let totalCuotas = calculateTotalCuotas(
      createProcessDto.loanData.planType
    )

    let cuotaInicial = calculateCuota(
      createProcessDto.loanData.salePrice,
      createProcessDto.loanData.initialFee
    )

    let cuotaFinal = calculateCuota(
      createProcessDto.loanData.salePrice,
      createProcessDto.loanData.finalFee
    )

    let montoPrestamo = calculateMontoPrestamo(
      createProcessDto.loanData.salePrice,
      cuotaInicial,
      createProcessDto.initialExpenses
    )

    let saldoFinanciarCoutas = calculateSaldoFinanciar(
      montoPrestamo,
      cuotaFinal,
      TEM,
      createProcessDto.periodicExpenses.monthlyCreditInsurance,
      totalCuotas
    )

    let resultadosFinanciamiento = {
      TEA: TEA * 100,
      TEM: TEM * 100,
      cuotasAnio,
      totalCuotas,
      cuotaInicial,
      cuotaFinal,
      montoPrestamo,
      saldoFinanciarCoutas
    }

    // Gastos periodicos

    let seguroDesgravPer = calculateSeguroDesgravPer(
      createProcessDto.periodicExpenses.monthlyCreditInsurance,
      createProcessDto.loanData.paymentFrequency
    )

    let seguroRiesgo = calculateSeguroRiesgo(
      createProcessDto.periodicExpenses.yearlyAllRiskInsurance,
      createProcessDto.loanData.salePrice,
      cuotasAnio,
    )

    let gastosPeriodicos = {
      seguroDesgravPer: seguroDesgravPer * 100,
      seguroRiesgo
    }

    // Totales Por

    let intereses

    let amortizacionCapital

    let seguroDesgravamen

    let seguroContraTodoRiesgo

    let GPS

    let portes

    let gastosAdministrativos

    let resultadosTotalesPor = {
      intereses,
      amortizacionCapital,
      seguroDesgravamen,
      seguroContraTodoRiesgo,
      GPS,
      portes,
      gastosAdministrativos
    }
    // Indicadores de Rentabilidad

    let tasaDescuento = calculateTasaDescuento(
      createProcessDto.oportunityCost.discountRate,
      createProcessDto.loanData.paymentFrequency,
      createProcessDto.loanData.daysPerYear
    )

    let TIR

    let TCEA

    let VAN

    let resultadosIndicadoresRentabilidad = {
      tasaDescuento: tasaDescuento *= 100,
      TIR,
      TCEA,
      VAN
    }

    let results = {
      "Resultados del Financiamiento": resultadosFinanciamiento,
      "Resultados de los costes/gastos Periodicos": gastosPeriodicos,
      "Resultados Totales Por": resultadosTotalesPor,
      "Resultados de Indicadores de Rentabilidad": resultadosIndicadoresRentabilidad,
      "Calculo de Plan de Pagos": calculatePaymentPlan(
        createProcessDto,
        resultadosFinanciamiento,
        gastosPeriodicos
      )
    }

    return results;
  }

  findAll() {
    return `This action returns all processes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} process`;
  }

  update(id: number, updateProcessDto: UpdateProcessDto) {
    return `This action updates a #${id} process`;
  }

  remove(id: number) {
    return `This action removes a #${id} process`;
  }
}
