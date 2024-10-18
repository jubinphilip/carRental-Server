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
export const uploadFile = async (file,userRole) => {

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
    const minioBucketPrivate=process.env.PRIVATE_BUCKET_NAME;
    if(userRole==='user')
        {
            await minioclient.putObject(
                minioBucketPrivate,
                filename,
                stream,
                { 'Content-Type': mimetype }
            );
        }
        else
        {
    await minioclient.putObject(
        minioBucket,
        filename,
        stream,
        { 'Content-Type': mimetype }
    );
}

    if(userRole==='user')
    {
        const fileUrl = `http://localhost:9000/${minioBucketPrivate}/${filename}`;
        return fileUrl; 
    }
    else
    {
    const fileUrl = `http://localhost:9000/${minioBucket}/${filename}`;
    return fileUrl; 
    }
 
};
