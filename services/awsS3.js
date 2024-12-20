import dotenv from "dotenv"
dotenv.config()
import { S3Client,PutObjectCommand } from "@aws-sdk/client-s3";


export async function uploadFile(data,fileName){
    
    // Configure AWS S3
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials:{
            accessKeyId:process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
        }

    });

    // S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET, // Your bucket name
        Key: fileName, // File name to save as in S3
        Body: data, // File buffer (in memory)
        ContentType: 'application/json', // File MIME type
        ACL:"public-read",
    };

    try {
        // Upload the file to S3
        const command = new PutObjectCommand(params);
        const responseData = await s3.send(command);
        return responseData;

    } catch (error) {
        console.log('file not uploaed to S3',error);
        throw new Error(error);
    }
}

