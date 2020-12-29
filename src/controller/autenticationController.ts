import { Request, Response } from "express";
import knex from "../database/connection";
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from "../config/auth";
export default class AutenticationController {

    constructor() { }

    async userAuth(request: Request, response: Response) {
        try {
            const { userName, password } = request.body;

            const trx = await knex.transaction();

            const userBd = await trx('user')
                .where('name', userName)
                .select('*')
                .first();

            if (!userBd) {
                await trx.commit();
                return response.status(400).send("Usuário não encontrado na base")
            }

            const token = jwt.sign({ id: userBd.id }, AUTH_CONFIG.secret, { expiresIn: AUTH_CONFIG.expiresIn });

            await trx.commit();
            return response.json({ userBd, token })
        } catch (error) {

        }
    }

}