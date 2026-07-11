export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    profileImage?: string;
    address?: string;
    city?: string;
}