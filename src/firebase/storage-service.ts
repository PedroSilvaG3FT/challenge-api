import * as firebaseAdmin from "firebase-admin";
import { SIGNED_URL_CONFIG, STORAGE_BUCKET } from '../firebase/firebase';
import stream from 'stream';
import crypto from 'crypto';

export const uploadImageStorage = function (base64: string, path: string, fileName?: string) : Promise<string> {

    return new Promise(async (resolve, reject) => {
        const hash = crypto.randomBytes(16).toString('hex');
        const fileNameStorage = fileName ? fileName : `${hash}`;
        
        console.log(fileNameStorage);
        
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


