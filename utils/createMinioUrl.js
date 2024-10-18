import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const minioClient = new Client({
    endPoint: process.env.END_POINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
});

export const createPresignedUrl = async (fileurl) => {
    return new Promise((resolve, reject) => {
        const url = fileurl;
        const urlParts = url.split('/');
        const bucketName = urlParts[3];
        const objectName = urlParts.slice(4).join('/');

        minioClient.presignedUrl('GET', bucketName, objectName, 3600, (err, presignedUrl) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Presigned URL: ', presignedUrl);
                resolve(presignedUrl);
            }
        });
    });
}