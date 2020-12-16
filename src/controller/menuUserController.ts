import knex from "../database/connection";
import { Request, Response } from "express";
import { MemberMenuInterface, MenuUserInterface } from "../interfaces/menuUser.interface";
import { MealInterface } from "../interfaces/menu.interface";
import { TypeMealEnum } from "../shared/enums/typeMeal.enum";
import { DayEnum } from "../shared/enums/day.enum";

export default class MenuUserController {

    constructor() { }

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;

            const trx = await knex.transaction();
            const menuUser = await trx('menu_user')
                                   .where('userId', userId)
                                   .where('active', true)
                                   .select('*')
                                   .first();

            const menu = await trx('menu').where('id', menuUser.menuId).select('*').first();
            const menuItem = await trx('menu_item').where('menuId', menuUser.menuId).select('*');
            const menuItemDay = await trx('menu_item_day').where('menuId', menuUser.menuId).select('*');

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
                    dayId: day.idDay,
                    dayName: DayEnum[day.idDay],
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
                            typeMealName: TypeMealEnum[meal.typeMealId],
                            typeMealId: meal.typeMealId,
                            descripition: meal.descripition,
                        } as MealInterface

                        itemDay.meals.push(newMeal)
                    }
                })
            });

            await trx.commit();

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

            return response.send("Menu Atribuido com sucesso");

        } catch (error) {
            response.send(error);
        }
    }
}