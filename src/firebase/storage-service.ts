import * as firebaseAdmin from "firebase-admin";
import { SIGNED_URL_CONFIG, STORAGE_BUCKET } from '../firebase/firebase';
import stream from 'stream';

export const uploadImageStorage = function (base64: string, path: string, fileName: string) {

    return new Promise(async (resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(base64, 'base64'));

        const bucket = await firebaseAdmin.storage().bucket(STORAGE_BUCKET);
        const file = bucket.file(`${path}/${fileName}.jpg`);

        bufferStream.pipe(file.createWriteStream({ metadata: { contentType: 'image/jpeg' } }))
            .on('error', error => reject(`Error on upload image: ${JSON.stringify(error)}`))
            .on('finish', async () => {
                const urlImage = await getURLImageStorage(path, fileName);

                resolve(urlImage)
            });
    })
};


export const getURLImageStorage = function (path: string, fileName: string) {

    return new Promise(async (resolve, reject) => {
        const bucket = await firebaseAdmin.storage().bucket(STORAGE_BUCKET);
        const imageUrl = await bucket.file(`${path}/${fileName}.jpg`).getSignedUrl(SIGNED_URL_CONFIG);
        
        resolve(imageUrl[0]);
    })
};