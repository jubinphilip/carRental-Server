import { Client } from 'minio';
import dotenv from 'dotenv';
dotenv.config();
const minioclient = new Client({
    endPoint: process.env.END_POINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
});
export const uploadFile = async (file) => {

    console.log("minio",file)
 const filename=file.file.filename
 const createReadStream=file.file.createReadStream
 const mimetype=file.file.mimetype

    console.log(filename)
    if (!filename) {
        throw new Error('Filename is undefined');
    }
    const stream = createReadStream();
    const minioBucket = process.env.BUCKET_NAME;
    await minioclient.putObject(
        minioBucket,
        filename,
        stream,
        { 'Content-Type': mimetype }
    );
    const fileUrl = `http://localhost:9000/${minioBucket}/${filename}`;
    return fileUrl; 
};
