import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import {BookingStatus} from "../../../generated/prisma/enums";
export interface CreateTechnician {
    bio: string;
    experience: number;
    hourlyRate?: number;
    skills?: string;
    nationalId?: string;
    certification?: string;
    userId?:string;
    availability?: IAvailabilitySlot[];
}
export interface UpdateTechnician {
    bio?: string;
    experience?: number;
    hourlyRate?: number;
    skills?: string;
    nationalId?: string;
    certification?: string;
    userId?:string;
    isAvailable?: boolean;
    availability?: IAvailabilitySlot[];
}
export interface IAvailabilitySlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface IUpdateAvailability {
    isAvailable: boolean;
    slots: IAvailabilitySlot[];
}
export interface ITechnicianQuery {
    searchTerm?: string;
    location?: string;
    category?: string;
    experience?: string;
    minRating?: string;
    maxHourlyRate?:number;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export interface IAvailabilitySlot {
    dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
}
export interface UpdateBookingStatus {
    status: BookingStatus;
}