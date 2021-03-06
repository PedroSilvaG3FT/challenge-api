import knex from "../database/connection";
import { Request, Response } from "express";
import { MemberMenuInterface, MenuUserInterface } from "../interfaces/menuUser.interface";
import { MealInterface } from "../interfaces/menu.interface";
import { TypeMealEnum } from "../shared/enums/typeMeal.enum";
import { DayEnum } from "../shared/enums/day.enum";;
import { uploadImageStorage } from "../firebase/storage-service";
import { PATH_STORAGE } from "../firebase/firebase-constants";

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

            const menu = await knex('menu')
                .where('id', menuUser.menuId)
                .select('*')
                .first();

            const menuItem = await knex('menu_item')
                .where('menuId', menuUser.menuId)
                .select('*');

            const menuItemDay = await knex('menu_item_day')
                .where('menuId', menuUser.menuId)
                .select('*')

            const menuUserItemImage = await knex('menu_user_item_image')
                .where('userId', userId)
                .select('*');

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
                        const itemImage = menuUserItemImage.find(item => item.menuItemId === mealtem.menuItemId) as any;

                        const newMeal = {
                            menuItemId: meal.id,
                            typeMealName: TypeMealEnum[meal.typeMealId],
                            typeMealId: meal.typeMealId,
                            descripition: meal.descripition,
                            menuUserItemImageId: itemImage?.id,
                            imageItem: itemImage?.image,
                            rating: itemImage?.rating ? String(itemImage?.rating) : null
                        } as MealInterface

                        itemDay.meals.push(newMeal)
                    }
                })
            });

            return response.status(200).json(menuMemberDTO);
        } catch (error) {
            return response.status(400).json({ message: error });
        }
    }

    async create(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: MenuUserInterface = request.body;

            const allMenuUser = await trx('menu_user').where('userId', data.userId).select('*');
            await trx('menu_user_item_image').where('userId', data.userId).delete();

            if (allMenuUser.length >= 1) {
                await trx('menu_user').where('userId', data.userId).update({ active: false });
            }

            data.active = true;
            data.dateCreation = new Date();

            await trx('menu_user').insert(data);

            await trx.commit();
            return response.status(200).json({ message: "Menu Atribuido com sucesso" });

        } catch (error) {
            await trx.commit();
            return response.status(400).json({ message: error || "ERRO" });
        }
    }

    async createImageItem(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: any = request.body;
            const image64: string = data.image64;

            await trx('menu_user_item_image')
                .where('menuItemId', data.menuItemId)
                .delete();

            const newImageItem = {
                image: '',
                userId: data.userId,
                dateCreation: new Date(),
                menuItemId: data.menuItemId,
            }

            newImageItem.image = await uploadImageStorage(image64, PATH_STORAGE.menu)

            await trx('menu_user_item_image').insert(newImageItem);

            await trx.commit();
            return response.status(200).json({ message: "Item atualizado com sucesso" });
        } catch (error) {
            await trx.commit();
            return response.status(400).json({ message: "DEU RUIM" });
        }
    }

    async updateRatingItem(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: any = request.body;

            await trx('menu_user_item_image')
                .where('id', data.menuUserItemImageId)
                .update({ rating: Number(data.rating) })

            await trx.commit();

            return response.status(200).json({ message: "Item atualizado com sucesso" });
        } catch (error) {
            await trx.commit();
            return response.status(400).json({ message: "DEU RUIM" });
        }
    }

    async removeByUserId(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const { userId } = request.params;
            await trx('menu_user_item_image').where('userId', userId).delete();
            await trx('menu_user').where('userId', userId).update({ active: false });

            await trx.commit();

            return response.status(200).json({ message: "Cardapio removido com sucesso" });
        } catch (error) {
            await trx.commit();
            return response.status(400).json({ message: "DEU RUIM" });
        }
    }
}