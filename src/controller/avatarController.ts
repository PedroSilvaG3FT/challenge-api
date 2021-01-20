import { Request, Response } from "express";
import { getAllByPathStorage } from '../firebase/storage-service';

export default class AvatarController {

    async getAll(request: Request, response: Response) {
        try {
            const avatarList = await getAllByPathStorage('avatar/');

            return response.status(200).json(avatarList);
        } catch (error) {
            return response.status(500).json({ message: error || "ERRO" });
        }
    }
}