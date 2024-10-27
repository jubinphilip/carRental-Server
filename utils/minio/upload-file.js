import { Client } from 'minio';
import dotenv from 'dotenv';
dotenv.config();
//Function  for uploading files to minio
const minioclient = new Client({
    endPoint: process.env.END_POINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
});
export const uploadFile = async (file,userRole) => {//userRole consists of the logginned user that is to check whether admin or user is inserting the image

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
    if(userRole==='user')//if the user is uploading a file then its passed to a private bucket
        {
            await minioclient.putObject(
                minioBucketPrivate,
                filename,
                stream,
                { 'Content-Type': mimetype }
            );
        }
        else//else the imgae us uploaded to  a public bucket
        {
    await minioclient.putObject(
        minioBucket,
        filename,
        stream,
        { 'Content-Type': mimetype }
    );
}
//Retriving the urls of uploaded images from specific buckets
    if(userRole==='user')
    {
        const fileUrl = `http://localhost:9000/${minioBucketPrivate}/${filename}`;
        return fileUrl; //returning file url
    }
    else
    {
    const fileUrl = `http://localhost:9000/${minioBucket}/${filename}`;
    return fileUrl; 
    }
 
};
