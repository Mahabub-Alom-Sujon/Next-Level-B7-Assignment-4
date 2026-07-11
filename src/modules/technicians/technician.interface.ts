import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import {BookingStatus} from "../../../generated/prisma/enums";
export interface CreateTechnician {
    bio: string;
    experience:number;
    hourlyRate?: number;
    skills?: string;
    availability?: boolean;
    nationalId?: string;
    certification?: string;
    // userId: string;
}
export interface UpdateTechnician {
    bio: string;
    experience:number;
    hourlyRate?: number;
    skills?: string;
    availability?: boolean;
    nationalId?: string;
    certification?: string;
    // userId: string;
}
export interface UpdateAvailabilityPayload {
    availableDays: string[];
    startTime: string;
    endTime: string;
}
export interface TechnicianQuery {
    location?: string;
    rating?: string;
}
export interface UpdateBookingStatus {
    status: BookingStatus;
}