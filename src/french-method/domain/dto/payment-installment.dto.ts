import {IsNotEmpty, IsNumber} from "class-validator";
import {PartialType} from "@nestjs/swagger";

export class CreatePaymentInstallmentDto {

    /*
    constructor(payment_number: number, initial_balance: number, payment_amount: number, interest_amount: number, amortization: number, installment: number, outstanding_balance: number) {
        this.payment_number = payment_number;
        this.initial_balance = initial_balance;
        this.payment_amount = payment_amount;
        this.interest_amount = interest_amount;
        this.amortization = amortization;
        this.installment = installment;
        this.outstanding_balance = outstanding_balance;
    }
     */

    @IsNumber()
    @IsNotEmpty()
    payment_number: number;
    @IsNumber()
    @IsNotEmpty()
    initial_balance: number;
    @IsNumber()
    @IsNotEmpty()
    payment_amount: number;
    @IsNumber()
    @IsNotEmpty()
    interest_amount: number;
    @IsNumber()
    @IsNotEmpty()
    amortization: number;
    @IsNumber()
    @IsNotEmpty()
    installment: number;
    @IsNumber()
    @IsNotEmpty()
    outstanding_balance: number;
}

export class UpdatePaymentInstallmentDto extends PartialType(CreatePaymentInstallmentDto){}