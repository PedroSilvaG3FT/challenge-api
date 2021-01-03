import knex from '../database/connection';
import { Request, Response } from "express";
import {
    MenuInterface,
    MenuInterfaceDTO,
    MenuItemInterface,
    MenuItemDayInterface,
} from "../interfaces/menu.interface";
export default class MenuController {

    constructor() { }

    async getAll(request: Request, response: Response) {
        try {
            const menuList = await knex('menu').select('*');
            return response.json(menuList);
        } catch (error) {
            return response.send(error);
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;

            const trx = await knex.transaction();

            const menu: MenuInterface = await trx('menu').where('id', id).select('*').first();
            const menuItem = await trx('menu_item').where('menuId', id).select('*');
            const menuItemDay = await trx('menu_item_day').where('menuId', id).select('*');

            const numberDays = menuItemDay.map(itemDay => itemDay.numberDay);
            const numberDayFilter = Array.from(new Set(numberDays)).sort();

            return response.json(menu);
        } catch (error) {
            return response.send(error);
        }
    }

    async disable(request: Request, response: Response) {
        try {
            const { id } = request.params;
            
            const menuStatus = await knex('menu').where('id', id).select('active').first();
            const newStatus = !menuStatus.active;

            await knex('menu').where('id', id).update({ active: newStatus });

            return response.status(200).json(
                { message: `Cardapio ${newStatus ? 'Habilitado' : 'Desabilitado'} com Sucesso` }
            );
        } catch (error) {
            return response.send(error);
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;

            await knex('menu').where('id', id).delete();
            await knex('menu_item').where('menuId', id).delete();
            await knex('menu_item_day').where('menuId', id).delete();
            await knex('menu_user').where('menuId', id).delete();

            return response.status(200).json(
                { message: `Cardapio Removido com Sucesso` }
            );
        } catch (error) {
            return response.send(error);
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: MenuInterfaceDTO = request.body;

            const newMenu: MenuInterface = {
                name: data.name,
                qtdDays: data.days.length,
                active: true,
                dateCreation: new Date(),
            };

            const trx = await knex.transaction();

            const insertedMenu = await trx('menu').insert(newMenu);

            data.days.forEach(async (day: any, index: number) => {
                const numberDay = index + 1;

                day.meals.forEach(async (meal: any) => {
                    const newMenuItem: MenuItemInterface = {} as MenuItemInterface;
                    const newMenuItemDay: MenuItemDayInterface = {} as MenuItemDayInterface;

                    newMenuItemDay.dayId = day.dayId;
                    newMenuItemDay.numberDay = numberDay;
                    newMenuItemDay.dateCreation = new Date();

                    newMenuItem.menuId = insertedMenu[0];
                    newMenuItem.typeMealId = meal.typeMealId;
                    newMenuItem.dateCreation = new Date();
                    newMenuItem.descripition = meal.descripition;

                    const insertedMenuItem = await trx('menu_item').insert(newMenuItem);
                    newMenuItemDay.menuId = insertedMenu[0];
                    newMenuItemDay.menuItemId = insertedMenuItem[0];

                    await trx('menu_item_day').insert(newMenuItemDay);
                    await trx.commit();
                });

            });

            return response.status(200).json(
                { message: "Cardapio Criado com Sucesso" }
            );
        } catch (error) {
            return response.send(error);
        }

    }

    async update(request: Request, response: Response) {
        try {
            const data: MenuInterfaceDTO = request.body;

            const trx = await knex.transaction();

            const menu: MenuInterface = await trx('menu').where('id', data.id).select('*').first();

            menu.name = data.name;
            if (data.name != menu.name) {
                await trx('menu').update(menu)
            }

            console.log('MENU :', menu);

            return response.status(200).json(
                { message: "Cardapio Atualizado com Sucesso" }
            );
        } catch (error) {
            return response.send(error);

        }
    }

}