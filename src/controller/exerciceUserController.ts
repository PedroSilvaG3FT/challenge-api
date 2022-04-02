import knex from "../database/connection";
import { Request, Response } from "express";
import { DayEnum } from "../shared/enums/day.enum";
import {
  ExerciceUserInterfaceDTO,
  DayExerciceMemberInterface,
  ItemExerciceMemberInterface,
} from "../interfaces/exerciceUser.interface";

export default class ExerciceUserController {
  constructor() {}

  async getByUserId(request: Request, response: Response) {
    try {
      const { userId } = request.params;
      const exerciceUserDays = await knex("exercice_user_day")
        .where("userId", userId)
        .select("*");
      const exerciceUserDayItems = await knex("exercice_user_day_item")
        .select("*")
        .leftJoin(
          "exercice",
          "exercice_user_day_item.exerciceId",
          "exercice.id"
        )
        .select("name")
        .where("userId", userId);

      const numberDays = exerciceUserDays.map((itemDay) => itemDay.numberDay);
      const numberDayFilter = Array.from(new Set(numberDays)).sort();

      const exercicesUser: DayExerciceMemberInterface[] = [];

      numberDayFilter.forEach((numberDay) => {
        const day = exerciceUserDays.filter(
          (itemDay) => itemDay.numberDay === numberDay
        )[0];

        const newDay: DayExerciceMemberInterface = {
          dayId: day.dayId,
          name: DayEnum[day.dayId],
          numberDay: day.numberDay,
          exercices: [],
        };

        exercicesUser.push(newDay);
      });

      exercicesUser.forEach((itemDay) => {
        const exercicesDay = exerciceUserDayItems.filter(
          (x) => itemDay.numberDay === x.numberDay
        );

        exercicesDay.forEach((exerciceItem) => {
          if (exerciceItem.numberDay === itemDay.numberDay) {
            const newExerciceItem: ItemExerciceMemberInterface = {
              amount: exerciceItem.amount,
              linkUrl: exerciceItem.linkUrl,
              isLink: exerciceItem.linkUrl ? true : false,
              exercice: {
                id: exerciceItem.exerciceId,
                name: exerciceItem.name,
              },
            };

            itemDay.exercices?.push(newExerciceItem);
          }
        });
      });

      return response.status(200).json(exercicesUser);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }

  async removeAllByUserId(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      await knex("exercice_user_day_item").where("userId", userId).delete();
      await knex("exercice_user_day").where("userId", userId).delete();

      return response
        .status(200)
        .json({ message: "Exercicos removidos com sucesso" });
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }

  async create(request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const data: ExerciceUserInterfaceDTO = request.body;

      await trx("exercice_user_day_item").where("userId", data.userId).delete();
      await trx("exercice_user_day").where("userId", data.userId).delete();

      data.days.forEach(async (day, index: number) => {
        const newExerciceDay = {
          dayId: day.dayId,
          userId: data.userId,
          active: true,
          numberDay: index + 1,
          dateCreation: new Date(),
        };

        if (!day.exercices.length) {
          await trx("exercice_user_day").insert(newExerciceDay);
          return;
        }

        day.exercices.forEach(async (exercice) => {
          const newExerciceItem = {
            exerciceUserDayId: 0,
            userId: data.userId,
            dayId: day.dayId,
            exerciceId: exercice.exercice,
            numberDay: index + 1,
            amount: exercice.amount,
            linkUrl: exercice.linkUrl,
          };

          const insertedDay = await trx("exercice_user_day").insert(
            newExerciceDay
          );
          newExerciceItem.exerciceUserDayId = insertedDay[0];

          await trx("exercice_user_day_item").insert(newExerciceItem);
          await trx.commit();
        });
      });

      return response
        .status(200)
        .json({ message: "Exercicios cadastrados com sucesso" });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: error || "ERRO" });
    }
  }

  async assignToMembers(request: Request, response: Response) {
    try {
      const payload: { usersId: number[]; days: any[] } = request.body;

      for (let userId of payload.usersId) {
        await knex("exercice_user_day_item").where("userId", userId).delete();
        await knex("exercice_user_day").where("userId", userId).delete();

        payload.days.forEach(async (day, index: number) => {
          const newExerciceDay = {
            userId,
            active: true,
            dayId: day.dayId,
            numberDay: index + 1,
            dateCreation: new Date(),
          };

          if (!day.exercices.length) {
            await knex("exercice_user_day").insert(newExerciceDay);
            return;
          }

          day.exercices.forEach(async (exercice: any) => {
            const newExerciceItem = {
              userId,
              dayId: day.dayId,
              numberDay: index + 1,
              exerciceUserDayId: 0,
              amount: exercice.amount,
              linkUrl: exercice.linkUrl,
              exerciceId: exercice.exercice,
            };

            const [id] = await knex("exercice_user_day").insert(newExerciceDay);

            newExerciceItem.exerciceUserDayId = id;

            await knex("exercice_user_day_item").insert(newExerciceItem);
          });
        });
      }

      return response
        .status(200)
        .json({ message: "Exercicios cadastrados com sucesso" });
    } catch (error) {
      return response.status(400).json({ message: error || "ERRO" });
    }
  }
}
