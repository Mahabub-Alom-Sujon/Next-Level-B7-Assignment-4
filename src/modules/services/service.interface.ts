export interface CreateServicePayload {
    title: string;
    description?: string;
    price: number;
    duration: number;
    serviceArea?: string;
    isAvailable?: boolean;
    technicianId: string;
    categoryId: string;
}

export interface ServiceQuery {
    type?: string;
    location?: string;
    minRating?: number;
}