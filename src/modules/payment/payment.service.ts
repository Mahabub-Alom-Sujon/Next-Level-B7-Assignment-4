import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import {BookingStatus, PaymentStatus} from "../../../generated/prisma/enums";
import { CreatePaymentPayload } from "./payment.interface";

const createPayment = async (
    customerId: string,
    payload: CreatePaymentPayload
) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: payload.bookingId,
        },
        include: {
            service: true,
            payments: true,
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.customerId !== customerId) {
        throw new Error("Unauthorized");
    }

    if (
        booking.status !== BookingStatus.ACCEPTED &&
        booking.status !== BookingStatus.COMPLETED
    ) {
        throw new Error(
            `Payment is allowed only for accepted or completed bookings. Current status: ${booking.status}`
        );
    }

    // Prevent duplicate payment
    if (booking.payments.length > 0) {
        throw new Error("Payment already exists");
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],

        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: booking.service.title,
                    },
                    unit_amount: Math.round(Number(booking.service.price) * 100),
                },
                quantity: 1,
            },
        ],

        success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,

        metadata: {
            bookingId: booking.id,
            customerId,
        },
    });

    const payment = await prisma.payment.create({
        data: {
            bookingId: booking.id,
            amount: booking.service.price,
            transactionId: session.id, // Store Checkout Session ID
            provider: "STRIPE",
            method: "CARD",
            status: PaymentStatus.PENDING,
        },
    });

    return {
        checkoutUrl: session.url,
        sessionId: session.id,
        payment,
    };
};

const handleWebhook = async (signature: string, body: Buffer) => {
    const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            if (session.payment_status !== "paid") {
                break;
            }

            await prisma.payment.update({
                where: {
                    transactionId: session.id,
                },
                data: {
                    status: PaymentStatus.PENDING,
                    paidAt: new Date(),
                },
            });

            console.log(`Payment ${session.id} completed.`);
            break;
        }

        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;

            await prisma.payment.update({
                where: {
                    transactionId: session.id,
                },
                data: {
                    status: PaymentStatus.FAILED,
                },
            });

            console.log(`Payment ${session.id} expired.`);
            break;
        }

        default:
            console.log(`Unhandled event: ${event.type}`);
    }

    return {
        received: true,
    };
};

const confirmPayment = async (paymentIntentId: string) => {

    // const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // console.log("Stripe Payment Intent Status:", intent.status);
    //
    // if (intent.status !== "succeeded") {
    //     throw new Error(
    //         `Payment not completed. Current Stripe status: ${intent.status}`
    //     );
    // }

    const payment = await prisma.payment.update({
        where: {
            transactionId: paymentIntentId,
        },
        data: {
            status: PaymentStatus.COMPLETED,
            paidAt: new Date(),
        },
    });

    return payment;
};

const getPayments = async (customerId: string) => {

    return prisma.payment.findMany({
        where: {
            booking: {
                customerId,
            },
        },
        include: {
            booking: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

};

const getPayment = async (
    customerId: string,
    paymentId: string
) => {

    return prisma.payment.findFirstOrThrow({
        where: {
            id: paymentId,
            booking: {
                customerId,
            },
        },
        include: {
            booking: true,
        },
    });

};

export const PaymentService = {
    createPayment,
    handleWebhook,
    confirmPayment,
    getPayments,
    getPayment,
};