import knex from "../database/connection";
import { Request, Response } from "express";
import { MenuUserInterface } from "../interfaces/menuUser.interface";

export default class MenuUserController {

    constructor() { }

    async getByUserId(request: Request, response: Response) {
        try {
            const { userId } = request.params;

        } catch (error) {
            response.send(error);
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: MenuUserInterface = request.body;

            

        } catch (error) {
            response.send(error);
        }
    }
}