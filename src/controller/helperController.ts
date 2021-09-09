import { Request, Response } from "express";
import knex from "../database/connection";
import { genereteAccessCode } from "../helper/accessCode.helper";
import { UserInterface } from "../interfaces/user.interface";

export default class HelperController {
    constructor() { }

    async updateAllAccessCode(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const userList: UserInterface[] = await trx('user')
                .where('isAdm', false)
                .select('*');

            userList.forEach(async user => {
                await trx('user').where('id', user.id).update({ accessCode: genereteAccessCode(5) });
                await trx.commit();
            })
            
            return response.status(200).json({ data: 'Códigos de acesso atualizados' })
        } catch (error) {
            return response.status(400).json({ message: error || "ERRO"})
        }
    }

    async updateAllDateApprove(request: Request, response: Response) {
        const trx = await knex.transaction();

        try {
            const userList: UserInterface[] = await trx('user')
                .where('isAdm', false)
                .select('*');

            userList.forEach(async user => {
                if(!user.dateApproval){
                    await trx('user').where('id', user.id).update({ dateApproval: user.dateCreation });
                    await trx.commit();
                }
            })
            
            return response.status(200).json({ data: 'Datas atualizadas' })
        } catch (error) {
            return response.status(400).json({ message: error || "ERRO"})
        }
    }
}