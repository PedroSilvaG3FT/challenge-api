import { Request, Response } from "express";
import knex from "../database/connection";
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from "../config/auth";
export default class AutenticationController {

    constructor() { }

    async userAuth(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const user = await knex('user')
                .where('email', email)
                .select('*')
                .first();


            if (!user) {
                return response.status(400).json({message:"Usuário não encontrado na base"})
            }

            const token = jwt.sign({ id: user.id }, AUTH_CONFIG.secret, { expiresIn: AUTH_CONFIG.expiresIn });

            return response.json({ user, token })
        } catch (error) {
            return response.json({message: "ERRO"||error})
        }
    }

}