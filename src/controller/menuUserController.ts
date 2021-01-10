import knex from "../database/connection";
import { Request, Response } from "express";
import { MemberMenuInterface, MenuUserInterface } from "../interfaces/menuUser.interface";
import { MealInterface, MenuItemInterface } from "../interfaces/menu.interface";
import { TypeMealEnum } from "../shared/enums/typeMeal.enum";
import { DayEnum } from "../shared/enums/day.enum";

export default class MenuUserController {

    constructor() { }

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;

            const menuUser = await knex('menu_user')
                .where('userId', userId)
                .where('active', true)
                .select('*')
                .first();

            const menu = await knex('menu').where('id', menuUser.menuId).select('*').first();
            const menuItem = await knex('menu_item').where('menuId', menuUser.menuId).select('*');
            const menuItemDay = await knex('menu_item_day').where('menuId', menuUser.menuId).select('*');

            const numberDays = menuItemDay.map(itemDay => itemDay.numberDay);
            const numberDayFilter = Array.from(new Set(numberDays)).sort();

            const menuMemberDTO: MemberMenuInterface = {
                menuId: menu.id,
                menuName: menu.name,
                qtdDays: menu.qtdDays,
                menuMemberId: menuUser.id,
                days: []
            }

            numberDayFilter.forEach(numberDay => {
                const day = menuItemDay.filter(itemDay => itemDay.numberDay === numberDay)[0];
                const newDay = {
                    dayId: day.dayId,
                    dayName: DayEnum[day.dayId],
                    numberDay: day.numberDay,
                    meals: [] as MealInterface[]
                }

                menuMemberDTO.days.push(newDay);
            });

            menuMemberDTO.days.forEach(itemDay => {
                const mealsDay = menuItemDay.filter(x => itemDay.numberDay === x.numberDay);

                mealsDay.forEach(mealtem => {
                    if (itemDay.numberDay === mealtem.numberDay) {
                        const meal = menuItem.find(item => item.id === mealtem.menuItemId) as any;

                        const newMeal = {
                            menuItemId: meal.id,
                            typeMealName: TypeMealEnum[meal.typeMealId],
                            typeMealId: meal.typeMealId,
                            descripition: meal.descripition,
                            imageItem: meal.imageItem
                        } as MealInterface

                        itemDay.meals.push(newMeal)
                    }
                })
            });

            return response.json(menuMemberDTO);
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

            return response.json({ message: "Menu Atribuido com sucesso" });

        } catch (error) {
            response.json({message: error || "ERRO"});
        }
    }

    async updateImageItem(request: Request, response: Response) {
        // const trx = await knex.transaction();
        console.log(request);
        return response.send("TESTANDO");

        // try {
        //     const data: any = request.body;
        //     console.log('Data', data);

        //     await trx('menu_item')
        //         .where('id', data.menuItemId)
        //         .update(data)
            
        //     await trx.commit();

        //     return response.json({ message: "Item atualizado com sucesso" });
        // } catch (error) {
        //     await trx.commit();
        //     return response.json({ message: "DEU RUIM" });
        // }
    }
}
