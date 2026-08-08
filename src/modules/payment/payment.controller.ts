import { catchAsync } from "../../utils/catch-async";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/send-response";
import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.createPayment(
        req.users!.id,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Stripe Checkout session created successfully",
        data: result,
    });
});

// const confirmPayment = catchAsync(async (req, res) => {
//     const { sessionId } = req.body;
//
//     if (!sessionId) {
//         throw new Error("paymentIntentId is required");
//     }
//
//     const result = await PaymentService.confirmPayment(sessionId);
//
//     sendResponse(res, {
//         success: true,
//         statusCode: 200,
//         message: "Payment confirmed successfully",
//         data: result,
//     });
// });
const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    if (!signature || typeof signature !== "string") {
        throw new Error("Missing Stripe-Signature header");
    }
    const result = await PaymentService.handleWebhook(
        signature,
        req.body as Buffer
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Webhook processed successfully",
        data: result,
    });
});

const getPayments = catchAsync(async (req, res) => {

    const result = await PaymentService.getPayments(req.users?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payments retrieved successfully",
        data: result,
    });

});

const getPaymentSingle = catchAsync(async (req, res) => {

    const result = await PaymentService.getPaymentSingle(
        req.users!.id,
        req.params.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment retrieved successfully",
        data: result,
    });

});

export const PaymentController = {
    createPayment,
    handleWebhook,
    //confirmPayment,
    getPayments,
    getPaymentSingle,
};