export interface CreateBookingPayload {
    bookingDate: string;
    bookingTime: string;
    address: string;
    note?: string;
    technicianId: string;
    serviceId: string;
}