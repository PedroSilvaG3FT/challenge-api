import { Request, Response } from "express";
import knex from "../database/connection";
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from "../config/auth";
export default class AutenticationController {

    constructor() { }

    async userAuth(request: Request, response: Response) {
        try {
            const { userName, password } = request.body;

            const userBd = await knex('user')
                .where('name', userName)
                .select('*')
                .first();

            if (!userBd) {
                return response.status(400).send("Usuário não encontrado na base")
            }

            const token = jwt.sign({ id: userBd.id }, AUTH_CONFIG.secret, { expiresIn: AUTH_CONFIG.expiresIn });

            return response.json({ userBd, token })
        } catch (error) {
            return response.send(error)
        }
    }

}