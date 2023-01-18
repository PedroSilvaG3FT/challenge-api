import knex from "../database/connection";
import { Request, Response } from "express";
import {
  MemberMenuInterface,
  MenuUserInterface,
} from "../interfaces/menuUser.interface";
import { MealInterface } from "../interfaces/menu.interface";
import { TypeMealEnum } from "../shared/enums/typeMeal.enum";
import { DayEnum } from "../shared/enums/day.enum";
import { uploadImageStorage } from "../firebase/storage-service";
import { PATH_STORAGE } from "../firebase/firebase-constants";
import { UserInterface } from "../interfaces/user.interface";
import { APP_TIMEOUT } from "../shared/constants/timeout.constant";

export default class MenuUserController {
  constructor() {}

  async getByUserId(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      const menuUser = await knex("menu_user")
        .where("userId", userId)
        .where("active", true)
        .select("*")
        .first();

      const menu = await knex("menu")
        .where("id", menuUser.menuId)
        .select("*")
        .first();

      const menuItem = await knex("menu_item")
        .where("menuId", menuUser.menuId)
        .select("*");

      const menuItemDay = await knex("menu_item_day")
        .where("menuId", menuUser.menuId)
        .select("*");

      const menuUserItemImage = await knex("menu_user_item_image")
        .where("userId", userId)
        .select("*");

      const numberDays = menuItemDay.map((itemDay: any) => itemDay.numberDay);
      const numberDayFilter = Array.from(new Set(numberDays)).sort();

      const menuMemberDTO: MemberMenuInterface = {
        menuId: menu.id,
        menuName: menu.name,
        qtdDays: menu.qtdDays,
        menuMemberId: menuUser.id,
        days: [],
      };

      numberDayFilter.forEach((numberDay) => {
        const day = menuItemDay.filter(
          (itemDay: any) => itemDay.numberDay === numberDay
        )[0];
        const newDay = {
          dayId: day.dayId,
          dayName: DayEnum[day.dayId],
          numberDay: day.numberDay,
          meals: [] as MealInterface[],
        };

        menuMemberDTO.days.push(newDay);
      });

      menuMemberDTO.days.forEach((itemDay) => {
        const mealsDay = menuItemDay.filter(
          (x: any) => itemDay.numberDay === x.numberDay
        );

        mealsDay.forEach((mealtem: any) => {
          if (itemDay.numberDay === mealtem.numberDay) {
            const meal = menuItem.find(
              (item: any) => item.id === mealtem.menuItemId
            ) as any;
            const itemImage = menuUserItemImage.find(
              (item: any) => item.menuItemId === mealtem.menuItemId
            ) as any;

            const newMeal = {
              menuItemId: meal.id,
              typeMealName: TypeMealEnum[meal.typeMealId],
              typeMealId: meal.typeMealId,
              descripition: meal.descripition,
              menuUserItemImageId: itemImage?.id,
              imageItem: itemImage?.image,
              rating: itemImage?.rating ? String(itemImage?.rating) : null,
              feedback: itemImage?.feedback || "",
            } as MealInterface;

            itemDay.meals.push(newMeal);
          }
        });
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

      const allMenuUser = await trx("menu_user")
        .where("userId", data.userId)
        .select("*");
      await trx("menu_user_item_image").where("userId", data.userId).delete();

      if (allMenuUser.length >= 1) {
        await trx("menu_user")
          .where("userId", data.userId)
          .update({ active: false });
      }

      data.active = true;
      data.dateCreation = new Date();

      await trx("menu_user").insert(data);

      await trx.commit();
      return response
        .status(200)
        .json({ message: "Menu Atribuido com sucesso" });
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

      await trx("menu_user_item_image")
        .where("menuItemId", data.menuItemId)
        .delete();

      const newImageItem = {
        image: "",
        userId: data.userId,
        dateCreation: new Date(),
        menuItemId: data.menuItemId,
      };

      newImageItem.image = await uploadImageStorage(image64, PATH_STORAGE.menu);

      await trx("menu_user_item_image").insert(newImageItem);

      await trx.commit();
      return response
        .status(200)
        .json({ message: "Item atualizado com sucesso" });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: "DEU RUIM" });
    }
  }

  async updateRatingItem(request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const data: any = request.body;
      const id = data.menuUserItemImageId;

      delete data["menuUserItemImageId"];

      await trx("menu_user_item_image").where("id", id).update(data);

      await trx.commit();

      return response
        .status(200)
        .json({ message: "Item atualizado com sucesso" });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: error });
    }
  }

  async removeByUserId(request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const { userId } = request.params;
      await trx("menu_user_item_image").where("userId", userId).delete();
      await trx("menu_user").where("userId", userId).update({ active: false });

      await trx.commit();

      return response
        .status(200)
        .json({ message: "Cardapio removido com sucesso" });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: "DEU RUIM" });
    }
  }

  async assignMenuToMembers(request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const { menuId, members } = request.body;

      for await (const userId of members) {
        const data = { menuId, userId } as MenuUserInterface;

        const [{ count: countMenuUser }] = await trx("menu_user")
          .where("userId", userId)
          .where("active", true)
          .count({ count: "*" });

        await trx("menu_user_item_image").where("userId", userId).delete();

        if (countMenuUser)
          await trx("menu_user")
            .where("userId", userId)
            .update({ active: false });

        data.active = true;
        data.dateCreation = new Date();

        await trx("menu_user").insert(data);
      }

      await trx.commit();
      return response
        .status(200)
        .json({ message: "Menu Atribuido com sucesso" });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: "DEU RUIM" });
    }
  }

  async assignMenuToAllMembers(request: Request, response: Response) {
    request.setTimeout(APP_TIMEOUT);

    const trx = await knex.transaction();

    try {
      const { menuId, userType } = request.body;

      const members: UserInterface[] = await knex("user")
        .where("type", String(userType))
        .where("active", true)
        .select("id");

      for await (const { id: userId } of members) {
        const data = { menuId, userId } as MenuUserInterface;

        const [{ count: countMenuUser }] = await trx("menu_user")
          .where("userId", userId)
          .where("active", true)
          .count({ count: "*" });

        await trx("menu_user_item_image").where("userId", userId).delete();

        if (countMenuUser)
          await trx("menu_user")
            .where("userId", userId)
            .update({ active: false });

        data.active = true;
        data.dateCreation = new Date();

        await trx("menu_user").insert(data);
      }

      await trx.commit();
      return response
        .status(200)
        .json({ members, message: "Menu Atribuido com sucesso" });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: "DEU RUIM" });
    }
  }
}
