import knex from "../database/connection";
import { Request, Response } from "express";
import { UserInterface } from "../interfaces/user.interface";

export default class UserController {

    constructor() { }

    async getAll(request: Request, response: Response) {
        try {
            const userList: UserInterface[] = await knex('user').select('*');

            return response.json(userList);
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;

            const user: UserInterface = await knex('user').where('id', id).select('*').first();

            return response.json(user);
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async getByEmail(request: Request, response: Response) {
        try {
            const { email } = request.params;
            const user: UserInterface = await knex('user').where('email', email).select('*').first();

            return response.json(user);
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: UserInterface = request.body;

            const trx = await knex.transaction();
            data.dateCreation = new Date();
            data.active = false;
            await trx('user').insert(data);
            await trx.commit();

            return response.json({ message: `Usuário : ${data.name} criado com sucesso` })
        } catch (error) {
            return response.json({ message: error || "Erro" });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const data: UserInterface = request.body;

            const trx = await knex.transaction();
            await trx('user').where('id', data.id).update(data);
            await trx.commit();

            return response.json({ message: `Usuário : ${data.name} atualizado com sucesso` })
        } catch (error) {
            return response.json({ message: error });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const { id } = request.params;

            await knex('user').where('id', id).update({ active: false });
            return response.json({ message: `Usuário removido com sucesso` })
        } catch (error) {
            return response.json({ message: error });
        }
    }

}