import { Request, Response } from "express";
import knex from "../database/connection";
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from "../config/auth";
import { _verify, _hash } from "../shared/cryptoHelper/cryptoHelper";
import { UserInterface } from "../interfaces/user.interface";
export default class AutenticationController {

    constructor() { }

    async userAuth(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const user: UserInterface = await knex('user')
                .where('email', email)
                .select('*')
                .first();

            if (!user) {
                return response.status(400).json({message:"Usuário não encontrado na base"});
            }
            const verifyPassword = await _verify(password, user.password as string);

            if (!verifyPassword) {
                return response.status(400).json({ message: "Senha incorreta!" });
            }

            const token = jwt.sign({ id: user.id }, AUTH_CONFIG.secret, { expiresIn: AUTH_CONFIG.expiresIn });

            return response.status(200).json({ user, token })
        } catch (error) {
            return response.json({ message: error || "ERRO"})
        }
    }

}