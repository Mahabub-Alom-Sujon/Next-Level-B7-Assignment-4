import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateReviewPayload } from "./review.interface";

const createReview = async (
    customerId: string,
    payload: CreateReviewPayload
) => {
    // Check booking
    const booking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: payload.bookingId,
        },
        include: {
            technician: true,
        },
    });

    // Booking must belong to customer
    if (booking.customerId !== customerId) {
        throw new Error("Unauthorized");
    }

    // Only completed bookings can be reviewed
    if (booking.status !== BookingStatus.COMPLETED) {
        throw new Error("Review can only be submitted after job completion.");
    }

    // Prevent duplicate review
    const existingReview = await prisma.review.findUnique({
        where: {
            bookingId: payload.bookingId,
        },
    });

    if (existingReview) {
        throw new Error("Review already exists.");
    }

    const review = await prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            bookingId: booking.id,
            customerId,
            technicianId: booking.technicianId,
        },
    });

    // Update technician rating
    const reviews = await prisma.review.findMany({
        where: {
            technicianId: booking.technicianId,
        },
    });

    const totalReviews = reviews.length;

    const averageRating =
        reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews;

    await prisma.technicianProfile.update({
        where: {
            id: booking.technicianId,
        },
        data: {
            totalReviews,
            averageRating,
        },
    });

    return review;
};

export const ReviewServices = {
    createReview,
};