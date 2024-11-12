"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_s3_1 = require("@aws-sdk/client-s3");
function uploadFile(data, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Configure AWS S3
        const s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION || 'notexist',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "notexist",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "notexist"
            }
        });
        // S3 upload parameters
        const params = {
            Bucket: process.env.AWS_BUCKET, // Your bucket name
            Key: fileName, // File name to save as in S3
            Body: data, // File buffer (in memory)
            ContentType: 'application/json', // File MIME type
            ACL: "public-read",
        };
        try {
            // Upload the file to S3
            const command = new client_s3_1.PutObjectCommand(params);
            const responseData = yield s3.send(command);
            return responseData;
        }
        catch (error) {
            console.log('file not uploaed to S3', error);
            throw new Error(error);
        }
    });
}
