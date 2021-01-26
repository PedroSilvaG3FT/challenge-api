import knex from '../database/connection';
import { Request, Response } from "express";
import { UserWeightInterface } from '../interfaces/userWeight.interface';

export default class UserWeightController {

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;
            const userWeightL: UserWeightInterface[] = await knex('user_weight').where('userId', userId).select('*');

            return response.status(200).json(userWeightL);
        } catch (error) {
            return response.status(400).json({ message: error });
        }
    }

    async create(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: UserWeightInterface = request.body;

            data.dateCreation = new Date();
            data.active = true;
            await trx('user_weight').where('userId', data.userId).update({ active: false });

            await trx('user_weight').insert(data);
            await trx.commit();

            return response.status(200).json({message: `Peso atribuido com sucesso`})
        } catch (error) {
            await trx.commit();
            return response.status(400).json({ message: error || "Erro" });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const { id } = request.params;

            await knex('user_weight').where('id', id).delete();
            return response.status(200).json({ message: `Histórico removido com sucesso` })
        } catch (error) {
            return response.status(400).json({ message: error });
        }
    }
}