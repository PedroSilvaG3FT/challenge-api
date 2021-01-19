import knex from '../database/connection';
import { Request, Response } from "express";
import { UserPaymentInterface } from "../interfaces/userPayment.interface";

export default class UserPaymentController {

    async getAll(request: Request, response: Response) {
        try {
            const userPaymentList: UserPaymentInterface[] = await
                knex('user_payment')
                    .select('*');

            return response.status(200).json(userPaymentList);
        } catch (error) {
            return response.status(500).json({ message: error || "ERRO" });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const userPayment: UserPaymentInterface = await
                knex('user_payment')
                    .where('id', id)
                    .select('*')
                    .first();

            return response.json(userPayment);
        } catch (error) {
            return response.status(500).json({ message: error || "ERRO" });
        }
    }

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;
            const userPaymentList: UserPaymentInterface[] = await
                knex('user_payment')
                    .where('userId', userId)
                    .select('*')

            return response.json(userPaymentList);
        } catch (error) {
            return response.status(500).json({ message: error || "ERRO" });
        }
    }

    async create(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: UserPaymentInterface = request.body;

            data.dateCreation = new Date();
            data.active = true;

            const value = 100;
            const plots = 3;

            for (let i = 0; i < plots; i++) {
                console.log("PARCELA :", i);
                const currentDate = new Date();
                
                const newUserPayment: UserPaymentInterface = {
                    active: true,
                    value: value,
                    userId: data.userId,
                    dueDate: new Date(),
                    dateCreation: new Date(),
                    paymentId: data.paymentId,
                } 

                console.log(newUserPayment)
            }

            trx.commit();
            return response.status(200).json({
                message: `Pagamentos do usuario criados com sucesso`
            })
        } catch (error) {
            trx.commit();
            return response.status(500).json({ message: error || "ERRO" });
        }
    }

    async update(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: UserPaymentInterface = request.body;

            trx.commit();
            return response.status(200).json({
                message: `Pagamentos do usuario atualizado com sucesso`
            })
        } catch (error) {
            trx.commit();
            return response.status(500).json({ message: error || "ERRO" });
        }
    }


}