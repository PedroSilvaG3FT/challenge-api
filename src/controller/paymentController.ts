import { Request, Response } from "express";
import { LIST_PAYMENT, PaymentEnum } from "../shared/enums/payment.enum";

export default class PaymentController {

    getAll(request: Request, response: Response) {
        try {
            return response.status(200).json(LIST_PAYMENT);
        } catch (error) {
            return response.status(500).json({message: error || "ERRO"});
        }
    }

    getById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const payment = LIST_PAYMENT.find(payment => payment.id === Number(id))

            return response.status(200).json(payment);
        } catch (error) {
            return response.status(500).json({ message: error || "ERRO" });
        }
    }
}