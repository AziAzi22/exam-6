import type { PaymentMethod } from "../enum/payment-method.enum.js";

export interface BuyProductDTO {
    paymentMethod: PaymentMethod;
    quantity: number;
    adress: string;
}