import { IRR, NPV } from "@formulajs/formulajs";
import { GracePeriod } from "../domain/entities/grace-period.entity";
import { PaymentInstallment } from "../domain/entities/payment-installment.entity";

type RateType = "EFFECTIVE" | "NOMINAL";
type PeriodType = "null" | "daily" | "biweekly" | "monthly" | "bimonthly" | "quarterly" | "quatrimesterly" | "semester" | "annually";
//                   dia       quincena    mes        bimestre     trimestre    cuatrimestre   semestre           anual

export const roundNumber = (n: number) => {
  return Math.round(n * 100) / 100;
};

export const validatePeriodType = (period: string) => {
    // reverse the logic to avoid the 'else' statement
    if (period === 'null' || period === 'daily' || period === 'biweekly' || period === 'monthly' || period === 'bimonthly' || period === 'quarterly' || period === 'quatrimesterly' || period === 'semester' || period === 'annually') return period as PeriodType;
    throw new Error("Invalid period");
}

export const getPeriodDays = (period: PeriodType) => {
    switch (period) {
        case "null":
        return 0;
        case "daily":
        return 1;
        case "biweekly":
        return 15;
        case "monthly":
        return 30;
        case "bimonthly":
        return 60;
        case "quarterly":
        return 90;
        case "quatrimesterly":
        return 120;
        case "semester":
        return 180;
        case "annually":
        return 360;
        default:
        throw new Error("Invalid period");
    }
};



export const calculateAnnualEffectiveRate = (rate_type: RateType, rate_value: number, days_per_year: number, capitalization_period_days: number, rate_period_days: number): number => {

    let result = 0;
    
    if (rate_type === 'NOMINAL') { //change this to EFFECTIVE, NOMINAL
        result = Math.pow(1 + (rate_value / (rate_period_days / capitalization_period_days)), days_per_year / capitalization_period_days) - 1;
    } else {
        result = Math.pow(1 + rate_value, 360 / rate_period_days) - 1;
    }
    
    return result;
}

export const calculateEffectiveRateByPaymentFrequency = (payment_frequency_days: number, annual_effective_rate: number, days_per_year: number) => {
    return Math.pow(1 + annual_effective_rate, payment_frequency_days / days_per_year) - 1;
}


export const calculateFinancedBalanceInstallment = (
  lease: number,
  final_ammount: number,
  effective_rate: number,
  fees_ammount: number,
) => {
  return lease - final_ammount / Math.pow(1 + effective_rate, fees_ammount + 1);
};

function PMT(rate, nper, pv, fv, type) {
  if (rate === 0) return -(pv + fv) / nper;

  const pvif = Math.pow(1 + rate, nper);
  let pmt = (-rate * pv * (pvif + fv)) / (pvif - 1);

  if (type === 1) {
    pmt /= 1 + rate;
  }

  return pmt;
}

export const calculatePaymentInstallments = (
  start_balance: number,
  amount_of_fees: number,
  effective_rate_by_payment_frequency: number,
  gracePeriods: GracePeriod,
  final_fee_ammount: number,
) => {
  // Initializa la data
  let initial_balance = start_balance;
  let final_balance = 0;

  let gracePeriodsMap = {};
  for (let i = 0; i < gracePeriods.period_numbers.length; i++) {
    gracePeriodsMap[gracePeriods.period_numbers[i]] = gracePeriods.type;
  }

  let results: PaymentInstallment[] = [];

  for (let i = 1; i <= amount_of_fees + 1; i++) {
    if (i >= 2 && i <= amount_of_fees) {
      initial_balance = final_balance;
    } else {
      if (i != 1) initial_balance = 0;
    }

    // CALCULATE INTEREST
    let interest_amount = -(
      initial_balance * effective_rate_by_payment_frequency
    );

    let payment_amount = 0;
    let amortization_ammount = 0;
    let grace_period = gracePeriodsMap[i];

    if (i < amount_of_fees + 1) {
      if (grace_period) {
        if (grace_period === "PARTIAL") {
          payment_amount = interest_amount;
        }
      } else {
        payment_amount = PMT(
          effective_rate_by_payment_frequency,
          amount_of_fees - i + 1,
          initial_balance,
          0,
          0,
        );
        amortization_ammount = payment_amount - interest_amount;
      }
    }

    if (grace_period === "TOTAL") {
      final_balance = initial_balance - interest_amount;
      payment_amount = 0;
      amortization_ammount = 0;
    } else {
      final_balance = initial_balance + amortization_ammount;
    }

    if (Math.abs(final_balance) < 1e-10) {
      // show 0 instead of a very small number
      final_balance = 0;
    }

    let flux = payment_amount;

    if (i === amount_of_fees + 1) {
      flux = -final_fee_ammount;
    }

    let payment_installment = new PaymentInstallment(
      i,
      initial_balance,
      interest_amount,
      payment_amount,
      amortization_ammount,
      flux,
      final_balance,
    );

    results.push(payment_installment);
  }

  return results;
};

export const calculateDiscountRate = (
  cok_percentage: number,
  payment_frequency_days: number,
  days_per_year: number,
) => {
  return (
    Math.pow(1 + cok_percentage, payment_frequency_days / days_per_year) - 1
  );
};

export const calculateInternalRateOfReturn = (
  installment_values_array: number[],
) => {
  // we use the 'Internal rate of return' function from the formulajs library since we cant implement it ourselves
  return IRR(installment_values_array, 0.1);
};

export const calculateNetPresentValue = (
  lease_amount: number,
  discount_rate: number,
  installment_values_array: number[],
) => {
  // we use the 'Net Present Value' function from the formulajs library since we cant implement it ourselves
  let npv = NPV(discount_rate, installment_values_array);

  if (npv instanceof Error) {
    throw new Error("Error calculating net present value");
  }

  return lease_amount + npv;
};
