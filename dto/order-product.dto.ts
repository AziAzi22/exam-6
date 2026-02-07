import type { PaymentMethod } from "../enum/payment-method.enum.js";

export interface BuyProductDTO {
  paymentMethod: PaymentMethod;
  quantity: number;
  adress: string;
}

export interface updateAdressOrderProductDTO {
  adress: string;
}

export interface updatePaymentMethodOrderProductDTO {
  paymentMethod: PaymentMethod;
}
