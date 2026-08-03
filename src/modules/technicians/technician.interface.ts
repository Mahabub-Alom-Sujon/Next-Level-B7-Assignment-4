import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import {BookingStatus} from "../../../generated/prisma/enums";
export interface CreateTechnician {
    bio: string;
    experience:number;
    hourlyRate?: number;
    skills?: string;
    // availability?: boolean;
    nationalId?: string;
    certification?: string;
    // userId: string;
}
export interface UpdateTechnician {
    bio: string;
    experience:number;
    hourlyRate?: number;
    skills?: string;
    // availability?: boolean;
    nationalId?: string;
    certification?: string;
    // userId: string;
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
export interface IAvailabilityPayload {
    isAvailable?: boolean;
    availableDays?: string[];
    availableFrom?: string;
    availableTo?: string;
}
export interface UpdateBookingStatus {
    status: BookingStatus;
}