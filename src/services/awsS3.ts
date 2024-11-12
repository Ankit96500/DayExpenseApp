import dotenv from "dotenv"
dotenv.config()
import { S3Client,PutObjectCommand,ObjectCannedACL } from "@aws-sdk/client-s3";


export async function uploadFile(data:Buffer | ReadableStream | Blob,fileName :string){
    
    // Configure AWS S3
    const s3 = new S3Client({
        region: process.env.AWS_REGION || 'notexist',
        credentials:{
            accessKeyId:process.env.AWS_ACCESS_KEY_ID || "notexist",
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY || "notexist"
        }

    });

    // S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET!, // Your bucket name
        Key: fileName, // File name to save as in S3
        Body: data, // File buffer (in memory)
        ContentType: 'application/json', // File MIME type
        ACL:"public-read" as ObjectCannedACL,
    };

    try {
        // Upload the file to S3
        const command = new PutObjectCommand(params);
        const responseData = await s3.send(command);
        return responseData;

    } catch (error:any) {
        console.log('file not uploaed to S3',error);
        throw new Error(error);
    }
}

