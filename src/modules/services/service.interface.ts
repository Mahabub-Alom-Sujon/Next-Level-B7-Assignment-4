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

export interface IServiceQuery {
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