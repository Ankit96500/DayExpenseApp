"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResponse = exports.getS3ObjectUrl = exports.generateFileName = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Utility function to generate a random file name
const generateFileName = () => {
    const randomBytes = crypto_1.default.randomBytes(16).toString('hex');
    // const extension = path.extname(originalName);
    return `${randomBytes}`;
};
exports.generateFileName = generateFileName;
const getS3ObjectUrl = (bucket, region, filename) => {
    return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
};
exports.getS3ObjectUrl = getS3ObjectUrl;
const CreateResponse = (state, message, data = null, error = null) => {
    return { state, message, data, error };
};
exports.CreateResponse = CreateResponse;
