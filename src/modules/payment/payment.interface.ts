export interface CreatePaymentPayload {
    bookingId: string;
}

export interface ConfirmPaymentPayload {
    paymentIntentId: string;
}