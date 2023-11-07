export class CreateProcessDto {
    loanData: {
        salePrice: number;
        planType: string;
        initialFee: number;
        finalFee: number;
        interestRate: number;
        interestRateType: string;
        capitalizationPeriod: string;
        paymentFrequency: number;
        daysPerYear: number;
    }
    initialExpenses: {
        notarial?: number;
        publicRecords?: number;
        appraisal?: number;
        titleStudy?: number;
        activationComission?: number;
    }
    periodicExpenses: {
        constantComission?: number;
        constantCarriage?: number;
        administrativeCost?: number;
        monthlyCreditInsurance?: number;
        yearlyAllRiskInsurance?: number;
    }
    oportunityCost: {
        discountRate: number;
    }
}
