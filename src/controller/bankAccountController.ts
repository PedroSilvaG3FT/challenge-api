import knex from '../database/connection';
import { Request, Response } from "express";
import { BankAccountInterface } from "../interfaces/bankAccount.interface";

export default class BankAccountController {

    async getAll(request: Request, response: Response) {
        try {
            const BankAccountList: BankAccountInterface[] = await
                knex('bank_account')
                    .where('active', true)
                    .select('*');

            return response.status(200).json(BankAccountList);
        } catch (error) {
            return response.status(500).json({ message: error || "ERRO" });
        }
    }

    async create(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: BankAccountInterface = request.body;

            data.dateCreation = new Date();
            data.active = true;

            await trx('bank_account').insert(data);

            await trx.commit();
            return response.json({ message: `Conta criada com sucesso` })
        } catch (error) {
            await trx.commit();
            return response.json({ message: error || "Erro" });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;

            await knex('bank_account').where('id', id).delete();
            return response.json({ message: `Conta removida com sucesso` })
        } catch (error) {
            return response.json({ message: error });
        }
    }
}