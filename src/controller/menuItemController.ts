import knex from '../database/connection';
import { Request, Response } from "express";
import { MenuItemDTOInterface } from '../interfaces/menuItem.interface';

export default class MenuItemController {
    constructor() { }

    async create(request: Request, response: Response) {
        try {
            const data: MenuItemDTOInterface = request.body;

            return response.status(200).json(
                { message: "Refeição Criada com Sucesso" }
            );
        } catch (error) {
            return response.send(error);
        }

    }

    async update(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: MenuItemDTOInterface = request.body;


            await trx('menu_item')
                .where('id', data.id)
                .update({ descripition: data.descripition });

            await trx.commit();
            
            return response.status(200).json(
                { message: "Refeição Atualizada com Sucesso" }
            );
        } catch (error) {
            await trx.commit();
            return response.send(error);
        }
    }

    async delete(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const { id } = request.params;

            await knex('menu_item_day').where('menuId', id).delete();
            await knex('menu_item').where('id', id).delete();

            return response.status(200).json({ message: `Refeição Removida com Sucesso` });
        } catch (error) {
            return response.send(error);
        }
    }

}