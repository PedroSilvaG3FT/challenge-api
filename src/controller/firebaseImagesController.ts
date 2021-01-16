import { Request, Response } from "express";
import * as firebase from "firebase-admin";
import { SIGNED_URL_CONFIG, STORAGE_BUCKET } from '../firebase/firebase';

export default class FirebaseImagesController {

    async getImage(request: Request, response: Response) {
        try {
            const bucket = await firebase.storage().bucket(STORAGE_BUCKET);
            const fileName = "security.png"
            const imageUrl = await bucket.file(`menu/${fileName}`).getSignedUrl(SIGNED_URL_CONFIG);

            return response.json({ imageUrl: imageUrl[0]});
        } catch (error) {
            
            return response.json({ message: error || "DEU RUIM" });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const bucket = await firebase.storage().bucket(STORAGE_BUCKET);
            const fileName = "my-file"
            const imageUrl = await bucket.file(`${fileName}`).getSignedUrl(SIGNED_URL_CONFIG);

            return response.json({ imageUrl: imageUrl[0] });
        } catch (error) {

            return response.json({ message: error || "DEU RUIM" });
        }
    }
}