import knex from '../database/connection';
import { Request, Response } from "express";
import { ExerciceInterface } from '../interfaces/exercice.interface';

export default class ExerciceController {
    
    async getAll(request: Request, response: Response) {
        try {
            const exerciceList: ExerciceInterface[] = await knex('user').select('*');

            return response.json(exerciceList);
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;

            const exercice: ExerciceInterface = await knex('exercice').where('id', id).select('*').first();

            return response.json(exercice);
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: ExerciceInterface = request.body;

            const trx = await knex.transaction();
            data.dateCreation = new Date();
            data.active = true;
            await trx('exercice').insert(data);
            await trx.commit();
            console.log(data);

            return response.json({ message: `Exercicio : ${data.name} criado com sucesso` })
        } catch (error) {
            return response.json({ message: error || "Erro" });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const data: ExerciceInterface = request.body;

            const trx = await knex.transaction();
            await trx('exercice').where('id', data.id).update(data);
            await trx.commit();

            return response.json({ message: `Exercicio : ${data.name} atualizado com sucesso` })
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const { id } = request.params;

            await knex('exercice').where('id', id).delete();
            return response.json({ message: `Exercicio removido com sucesso` })
        } catch (error) {
            return response.json({ message: error });
        }
    }
}