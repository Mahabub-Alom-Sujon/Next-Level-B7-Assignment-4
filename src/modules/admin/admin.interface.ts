export interface CreateCategory {
    name: string;
    description?: string;
    //icon?: String;
}

export interface Query {
    page?: string;
    limit?: string;
    searchTerm?: string;
}