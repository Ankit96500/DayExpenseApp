import path from "path";
import crypto from "crypto";


// Utility function to generate a random file name
export const generateFileName = ():string => {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    // const extension = path.extname(originalName);

    return `${randomBytes}`;
};


export const getS3ObjectUrl = (bucket:string,region:any,filename:string):any =>{
    return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
}

interface response{
    state: string;
    message: string;
    data: any | null;
    error: string | null;
}

export const CreateResponse = (state:string,message:string,data:any|null=null,error:string|null = null):response =>{
    return {state,message,data,error};
};  


