export interface CreateBookingPayload {
    bookingDate: string;
    customerAddress: string;
    note?: string;
    totalAmount: number;
    technicianId: string;
    serviceId: string;
}