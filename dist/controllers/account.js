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
exports.postSignupUser = postSignupUser;
exports.postLoginUser = postLoginUser;
exports.updateUserIncome = updateUserIncome;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = __importDefault(require("sequelize"));
const saltRounds = 10;
function postSignupUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        try {
            const hashpassword = yield bcrypt_1.default.hash(password, saltRounds);
            const data = yield user_1.default.create({
                name: name,
                password: hashpassword,
                email: email,
            });
            res
                .status(201)
                .json({ data: data });
        }
        catch (error) {
            if (error instanceof sequelize_1.default.UniqueConstraintError) {
                res.status(400).json({ error: 'Email Must Be Unique' });
            }
            else {
                res.status(500).json({ error: "Something went wrong" });
            }
        }
    });
}
function postLoginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        try {
            // first check , given email exist or not
            const user = yield user_1.default.findOne({
                where: {
                    email: email,
                },
            });
            // If the user does not exist
            if (!user) {
                res.status(404).json({ error: "User does not exist" });
                return;
            }
            // If the user exists, compare the provided password with the stored hashed password
            const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
            // If the password does not match
            if (!isPasswordMatch) {
                res.status(401).json({ error: "Incorrect password" });
                return;
            }
            // If both email and password are correct, send the user data as the response
            jsonwebtoken_1.default.sign({ userID: user.id, name: user.name }, process.env.JWT_SECRET_KEY || 'not exist', (err, token) => {
                if (err) {
                    res.status(500).json({ error: "token not generated" });
                }
                res.status(200).json({ token: token });
            });
        }
        catch (error) {
            res.status(500).json({ error: "An error occurred during login" });
        }
    });
}
function updateUserIncome(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const income = parseInt(req.body.income) || 0;
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            let user = req.user;
            if (!user) {
                res.status(400).json({ error: "User not found." });
                return;
            }
            user.total_income = income;
            user.save();
            res.status(201).json({ data: user.total_income });
        }
        catch (error) {
            res.status(201).json({ error: "not Updated User Income" });
        }
    });
}
