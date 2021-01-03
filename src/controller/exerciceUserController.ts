import knex from "../database/connection";
import { Request, Response } from "express";
import { DayEnum } from "../shared/enums/day.enum";
import { ExerciceUserInterfaceDTO, DayExerciceMemberInterface, ItemExerciceMemberInterface } from "../interfaces/exerciceUser.interface";

export default class ExerciceUserController {

    constructor() { }

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;
            const exerciceUserDays = await knex('exercice_user_day').where('userId', userId).select('*');
            const exerciceUserDayItems = await 
                knex('exercice_user_day_item')
                .join('exercice', 'exercice_user_day_item.exerciceId', '=', 'exercice.id')
                .select('name')
                .where('userId', userId)
                .select('*');

            console.log(exerciceUserDayItems)
            const numberDays = exerciceUserDays.map(itemDay => itemDay.numberDay);
            const numberDayFilter = Array.from(new Set(numberDays)).sort();

            const exercicesUser: DayExerciceMemberInterface[] = [];

            numberDayFilter.forEach(numberDay => {
                const day = exerciceUserDays.filter(itemDay => itemDay.numberDay === numberDay)[0];

                const newDay: DayExerciceMemberInterface = {
                    dayId: day.dayId,
                    name: DayEnum[day.dayId],
                    numberDay: day.numberDay,
                    exercices: []
                }

                exercicesUser.push(newDay);
            });

            exercicesUser.forEach(itemDay => {
                const exercicesDay = exerciceUserDayItems.filter(x => itemDay.numberDay === x.numberDay);

                exercicesDay.forEach(exerciceItem => {
                    if(exerciceItem.numberDay === itemDay.numberDay) {
                        const newExerciceItem: ItemExerciceMemberInterface = {
                            amount: exerciceItem.amount,
                            exercice: {
                                id: exerciceItem.exerciceId,
                                name: exerciceItem.name
                            }
                        }

                        itemDay.exercices?.push(newExerciceItem)
                    }
                })
            })

            return response.json(exercicesUser);
        } catch (error) {
            response.send(error);
        }
    }

    async create(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const data: ExerciceUserInterfaceDTO = request.body;
            console.log("USER ID :", data.userId);

            await trx('exercice_user_day').where('userId', data.userId).delete();
            await trx('exercice_user_day_item').where('userId', data.userId).delete();

            data.days.forEach(async (day, index: number) => {
                const newExerciceDay = {
                    dayId: day.dayId,
                    userId: data.userId,
                    active: true,
                    numberDay: index + 1,
                    dateCreation: new Date()
                }

                day.exercices.forEach(async (exercice) => {

                    const newExerciceItem = {
                        exerciceUserDayId: 0,
                        userId: data.userId,
                        dayId: day.dayId,
                        exerciceId: exercice.exercice,
                        numberDay: index + 1,
                        amount: exercice.amount
                    }

                    const insertedDay = await trx('exercice_user_day').insert(newExerciceDay);
                    newExerciceItem.exerciceUserDayId = insertedDay[0];

                    await trx('exercice_user_day_item').insert(newExerciceItem);
                    await trx.commit();
                })

            })

            return response.json({ message: "Exercicios cadastrados com sucesso" });

        } catch (error) {
            await trx.commit();
            response.json({ message: error || "ERRO" });
        }
    }
}