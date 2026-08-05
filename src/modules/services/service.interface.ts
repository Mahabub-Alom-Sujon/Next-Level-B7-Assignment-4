export interface CreateServicePayload {
    title: string;
    description?: string;
    price: number;
    duration: number;
    image?:string;
    serviceArea?: string;
    isAvailable?: boolean;
    technicianId: string;
    categoryId: string;
}

export interface IServiceQuery {
    categoryId?: string;
    technicianId?:string;
    category?: string;
    location?: string;
    rating?: string;
    searchTerm?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface IEditService {
    serviceId: string;
    title: string;
    description?: string;
    price: number;
    duration: number;
    image?:string;
    serviceArea?: string;
    isAvailable?: boolean;
    technicianId: string;
    categoryId: string;
}