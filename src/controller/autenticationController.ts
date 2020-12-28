import { Request, Response } from "express";
import knex from "../database/connection";
import jwt from 'jsonwebtoken';

const authConfig = require('../config/auth.json');

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

            const token = jwt.sign({ id: userBd.id }, authConfig.secret, { expiresIn: authConfig.expiresIn });

            await trx.commit();
            return response.json({ userBd, token })
        } catch (error) {

        }
    }

}