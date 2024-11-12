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
exports.UserAuthorized = UserAuthorized;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// check weather the given request is vaild user request or not;
function UserAuthorized(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.header('Authorization');
            if (!token) {
                res.status(401).json({ success: false, error: 'Unauthorized request. No token provided.' });
                return;
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || 'default');
            const user = yield user_1.default.findByPk(decodedToken.userID);
            if (!user) {
                res.status(401).json({ success: false, error: 'Unauthorized request. Invalid token.' });
                return;
            }
            // console.log('user coming: ',user);
            req.user = user; // You can now safely set req.user because of the type extension
            next();
        }
        catch (error) {
            res.status(401).json({ success: false, error: 'Token verification failed.' });
            return;
        }
    });
}
