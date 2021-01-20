import stream from 'stream';
import crypto from 'crypto';
import * as firebaseAdmin from "firebase-admin";
import { SIGNED_URL_CONFIG, STORAGE_BUCKET } from './firebase-constants';

export const uploadImageStorage = function (base64: string, path: string, fileName?: string) : Promise<string> {

    return new Promise(async (resolve, reject) => {
        const hash = crypto.randomBytes(16).toString('hex');
        const fileNameStorage = fileName ? fileName : `${hash}`;

        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(base64, 'base64'));

        const bucket = await firebaseAdmin.storage().bucket(STORAGE_BUCKET);
        const file = bucket.file(`${path}/${fileNameStorage}.jpg`);

        bufferStream.pipe(file.createWriteStream({ metadata: { contentType: 'image/jpeg' } }))
            .on('error', error => reject(`Error on upload image: ${JSON.stringify(error)}`))
            .on('finish', async () => {
                const urlImage = await getURLImageStorage(path, fileNameStorage);

                resolve(urlImage)
            });
    })
};

export const getURLImageStorage = function (path: string, fileName: string) : Promise<string> {

    return new Promise(async (resolve, reject) => {
        const bucket = await firebaseAdmin.storage().bucket(STORAGE_BUCKET);
        const imageUrl = await bucket.file(`${path}/${fileName}.jpg`).getSignedUrl(SIGNED_URL_CONFIG);

        resolve(imageUrl[0]);
    })
};

export const getAllByPathStorage = function (path: string): Promise<any[]> {

    return new Promise(async (resolve, reject) => {

        const bucket = await firebaseAdmin.storage().bucket(STORAGE_BUCKET);
        const filesBucket = await bucket.getFiles({ prefix: path });
        filesBucket[0].splice(0, 1);

        const imagesList = filesBucket[0];

        let newList: ImageListDTO[] = [];
        let counterImage = 1;

        for await (let image of imagesList) {
            const file = image.metadata;
            const imageUrl = await bucket.file(file.name).getSignedUrl(SIGNED_URL_CONFIG);

            const newImage: ImageListDTO = {
                numberImage: counterImage++, 
                imageUrl: imageUrl[0]
            };

            newList.push(newImage);
        }

        resolve(newList);
    })
};


interface ImageListDTO {
    numberImage: number,
    imageUrl: string
}

