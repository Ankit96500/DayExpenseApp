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
exports.getLeaderBoardData = exports.LeaderBoard = void 0;
const user_1 = __importDefault(require("../models/user"));
// premiummemebership features
const LeaderBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(201).json({ data: "fetch leader borad data" });
    }
    catch (error) {
        res.status(401).json({ error: error });
    }
});
exports.LeaderBoard = LeaderBoard;
const getLeaderBoardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_1.default.findAll({
            attributes: ['name', 'total_expense'],
            order: [['total_expense', 'ASC']]
        });
        const ldata = data.map((user, index) => ({
            'S.no': index + 1,
            name: user.name,
            total_expense: user.total_expense
        }));
        // console.log('--->',JSON.stringify(ldata));
        res.status(201).json({ data: ldata });
    }
    catch (error) {
        // console.log('err---',error);
        res.status(401).json({ error: error });
    }
});
exports.getLeaderBoardData = getLeaderBoardData;
