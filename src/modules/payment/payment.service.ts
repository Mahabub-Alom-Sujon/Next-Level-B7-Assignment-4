import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import {BookingStatus, PaymentStatus} from "../../../generated/prisma/enums";
import { CreatePaymentPayload } from "./payment.interface";

// const createPayment = async (
//     customerId: string,
//     payload: CreatePaymentPayload
// ) => {
//     const booking = await prisma.booking.findUnique({
//         where: {
//             id: payload.bookingId,
//         },
//         include: {
//             service: true,
//             payments: true,
//         },
//     });
//
//     if (!booking) {
//         throw new Error("Booking not found");
//     }
//
//     if (booking.customerId !== customerId) {
//         throw new Error("Unauthorized");
//     }
//
//     if (
//         booking.status !== BookingStatus.ACCEPTED &&
//         booking.status !== BookingStatus.COMPLETED
//     ) {
//         throw new Error(
//             `Payment is allowed only for accepted or completed bookings. Current status: ${booking.status}`
//         );
//     }
//
//     // Prevent duplicate payment
//     if (booking.payments.length > 0) {
//         throw new Error("Payment already exists");
//     }
//
//
//
//     const session = await stripe.checkout.sessions.create({
//         mode: "payment",
//         payment_method_types: ["card"],
//
//         line_items: [
//             {
//                 price_data: {
//                     currency: "bdt",
//                     unit_amount: Math.round(Number(booking.service.price) * 100),
//                     product: process.env.STRIPE_PRODUCT_ID!,
//                 },
//                 quantity: 1,
//             },
//         ],
//         success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//
//         cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
//
//         metadata: {
//             bookingId: booking.id,
//             customerId,
//         },
//     });
//
//     const payment = await prisma.payment.create({
//         data: {
//             bookingId: booking.id,
//             amount: booking.service.price,
//             transactionId: session.id, // Store Checkout Session ID
//             provider: "STRIPE",
//             method: "CARD",
//             status: PaymentStatus.PENDING,
//         },
//     });
//
//
//     return {
//         checkoutUrl: session.url,
//         sessionId: session.id,
//         payment,
//     };
// };

// const createPayment = async (
//     customerId: string,
//     payload: CreatePaymentPayload
// ) => {
//     const booking = await prisma.booking.findUnique({
//         where: {
//             id: payload.bookingId,
//         },
//         include: {
//             service: true,
//             payments: true,
//         },
//     });
//
//     if (!booking) {
//         throw new Error("Booking not found");
//     }
//
//     if (booking.customerId !== customerId) {
//         throw new Error("Unauthorized");
//     }
//
//     if (
//         booking.status !== BookingStatus.ACCEPTED &&
//         booking.status !== BookingStatus.COMPLETED
//     ) {
//         throw new Error(
//             `Payment is allowed only for accepted or completed bookings. Current status: ${booking.status}`
//         );
//     }
//
//     if (booking.payments.length > 0) {
//         throw new Error("Payment already exists");
//     }
//
//     // Create payment first
//     const payment = await prisma.payment.create({
//         data: {
//             bookingId: booking.id,
//             amount: booking.service.price,
//             provider: "STRIPE",
//             method: "CARD",
//             status: PaymentStatus.PENDING,
//         },
//     });
//
//     // Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//         mode: "payment",
//         payment_method_types: ["card"],
//
//         line_items: [
//             {
//                 price_data: {
//                     currency: "bdt",
//                     unit_amount: Math.round(Number(booking.service.price) * 100),
//                     product: process.env.STRIPE_PRODUCT_ID!,
//                 },
//                 quantity: 1,
//             },
//         ],
//
//         metadata: {
//             paymentId: payment.id,
//             bookingId: booking.id,
//             customerId,
//         },
//
//         success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
//     });
//
//     // // Save Checkout Session ID
//     // await prisma.payment.update({
//     //     where: {
//     //         id: payment.id,
//     //     },
//     //     data: {
//     //         transactionId: session.id,
//     //     },
//     // });
//
//     return {
//         checkoutUrl: session.url,
//         sessionId: session.id,
//         payment: {
//             ...payment,
//             transactionId: session.id,
//         },
//     };
// };

// const handleWebhook = async (signature: string, body: Buffer) => {
//     const event = stripe.webhooks.constructEvent(
//         body,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET!
//     );
//
//     switch (event.type) {
//         case "checkout.session.completed": {
//             const session = event.data.object as Stripe.Checkout.Session;
//
//             if (session.payment_status !== "paid") {
//                 break;
//             }
//
//             await prisma.payment.update({
//                 where: {
//                     transactionId: session.id,
//                 },
//                 data: {
//                     status: PaymentStatus.PENDING,
//                     paidAt: new Date(),
//                 },
//             });
//
//             console.log(`Payment ${session.id} completed.`);
//             break;
//         }
//
//         case "checkout.session.expired": {
//             const session = event.data.object as Stripe.Checkout.Session;
//
//             await prisma.payment.update({
//                 where: {
//                     transactionId: session.id,
//                 },
//                 data: {
//                     status: PaymentStatus.FAILED,
//                 },
//             });
//
//             console.log(`Payment ${session.id} expired.`);
//             break;
//         }
//
//         default:
//             console.log(`Unhandled event: ${event.type}`);
//     }
//
//     return {
//         received: true,
//     };
// };
//
// const confirmPayment = async (paymentIntentId: string) => {
//
//     // const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
//
//     // console.log("Stripe Payment Intent Status:", intent.status);
//     //
//     // if (intent.status !== "succeeded") {
//     //     throw new Error(
//     //         `Payment not completed. Current Stripe status: ${intent.status}`
//     //     );
//     // }
//
//     const payment = await prisma.payment.update({
//         where: {
//             transactionId: paymentIntentId,
//         },
//         data: {
//             status: PaymentStatus.COMPLETED,
//             paidAt: new Date(),
//         },
//     });
//
//     return payment;
// };

const handleWebhook = async (signature: string, body: Buffer) => {
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        throw new Error("Invalid Stripe webhook signature.");
    }
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            if (session.payment_status !== "paid") {
                break;
            }

            const paymentId = session.metadata?.paymentId;

            if (!paymentId) {
                throw new Error("Payment ID not found in session metadata.");
            }
            await prisma.payment.update({
                where: {
                    id: paymentId,
                },
                data: {
                    status: PaymentStatus.COMPLETED,
                    transactionId:
                        typeof session.payment_intent === "string"
                            ? session.payment_intent
                            : session.id,
                    paidAt: new Date(),
                },
            });

            console.log(`✅ Payment ${paymentId} completed.`);
            break;
        }

        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;

            const paymentId = session.metadata?.paymentId;

            if (!paymentId) {
                break;
            }

            await prisma.payment.update({
                where: {
                    id: paymentId,
                },
                data: {
                    status: PaymentStatus.FAILED,
                },
            });

            console.log(`Payment ${paymentId} expired.`);
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return {
        received: true,
    };
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
    //createPayment,
    handleWebhook,
    //confirmPayment,
    getPayments,
    getPayment,
};