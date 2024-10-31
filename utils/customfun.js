import path from "path";
import crypto from "crypto";


// Utility function to generate a random file name
export const generateFileName = () => {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    // const extension = path.extname(originalName);

    return `${randomBytes}`;
};


export const getS3ObjectUrl = (bucket,region,filename) =>{
    return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
}


