import knex from "../database/connection";
import { Request, Response } from "express";
import { MenuUserInterface } from "../interfaces/menuUser.interface";

export default class MenuUserController {

    constructor() { }

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;

            const allMenuUser = await knex('menu_user').where('userId', userId).select('*');

            return response.json(allMenuUser);
        } catch (error) {
            response.send(error);
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: MenuUserInterface = request.body;

            const trx = await knex.transaction();

            const allMenuUser = await trx('menu_user').where('userId', data.userId).select('*');

            if (allMenuUser.length >= 1) {
                await trx('menu_user').where('userId', data.userId).update({ active: false });
            }

            data.active = true;
            data.dateCreation = new Date();
            await trx('menu_user').insert(data);
            trx.commit();

            return response.send("Menu Atribuido com sucesso");

        } catch (error) {
            response.send(error);
        }
    }
}