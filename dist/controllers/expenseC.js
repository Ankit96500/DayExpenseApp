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
exports.downloadReport = exports.deletedata = exports.adddata = exports.getdata = void 0;
const database_1 = __importDefault(require("../config/database"));
const expenseM_1 = __importDefault(require("../models/expenseM"));
const customfun_1 = require("../utils/customfun");
const awsS3_1 = require("../services/awsS3");
const getdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qpage = typeof req.query.page === 'string' ? req.query.page : "1";
    const qlimit = typeof req.query.limit === 'string' ? req.query.limit : "4";
    try {
        //get page and limit for query parametrs --- [pagination code]:
        const page = parseInt(qpage);
        const limit = parseInt(qlimit);
        // calculate the offset (skip items) for pagination
        const offset = (page - 1) * limit;
        // Fetch total count of records (without pagination, used for frontend display)
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const totalItems = yield req.user.countExpensetb();
        // Fetch the data with pagination (using offset and limit)
        const data = yield req.user.getExpensetb({
            limit: limit, offset: offset
        });
        // Calculate the total number of pages
        const totalPages = Math.ceil(totalItems / limit);
        // Respond with paginated data, current page info, and total pages
        res.status(200).json({
            data: data,
            currentPage: page,
            totalItems: totalItems,
            totalPages: totalPages,
            user: req.user
        });
    }
    catch (error) {
        res.status(401).json({ error: "DB Sorry Try Again.." });
    }
});
exports.getdata = getdata;
const adddata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const userid = req.user.id;
    const { expense_amount, desc, category } = req.body;
    const t = yield database_1.default.transaction();
    try {
        yield expenseM_1.default.create({
            expense_amount: expense_amount,
            desc: desc,
            category: category,
            UserID: userid
        }, { transaction: t });
        let user = req.user;
        user.total_expense += Number(expense_amount);
        yield user.save({ transaction: t });
        yield t.commit();
        res.status(201).json({ 'msg': "ok Data Created.." });
    }
    catch (error) {
        yield t.rollback();
        // Log and send error response
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to add expense. Please try again later.' });
    }
});
exports.adddata = adddata;
const deletedata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.default.transaction();
    const id = req.params.id;
    // console.log('--------------',req.params);
    try {
        const expense = yield expenseM_1.default.findByPk(id);
        if (!expense) {
            res.status(404).json({ msg: "Expense not found." });
            return;
        }
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        let user = req.user;
        // user.total_expense -= Number(expense.expense_amount) 
        user.total_expense -= expense.get('expense_amount');
        yield user.save({ transaction: t });
        yield expense.destroy({ transaction: t });
        // Commit the transaction if everything is successful
        yield t.commit();
        res.status(201).json({ 'msg': "ok Data Deleted.." });
    }
    catch (error) {
        yield t.rollback();
        res.status(500).json({ error: "Failed to delete expense. Please try again later." });
    }
});
exports.deletedata = deletedata;
const downloadReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const expense = yield req.user.getExpensetb();
        const stringifiedData = JSON.stringify(expense);
        const fileName = (0, customfun_1.generateFileName)();
        const bufferData = Buffer.from(stringifiedData);
        yield (0, awsS3_1.uploadFile)(bufferData, fileName);
        const fileURL = (0, customfun_1.getS3ObjectUrl)(process.env.AWS_BUCKET || 'notexist', process.env.AWS_REGION || "notexist", fileName);
        yield req.user.createExpensereporttb({
            rlink: fileURL,
            UserID: req.user.id, // Add the UserID field
        });
        res.status(201).json({ data: fileURL, success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Failed To Download Report ! Check Network" });
    }
});
exports.downloadReport = downloadReport;
// export const editdata = (req,res)=>{ }
// export const geteditdata  = (req,res)=>{ }
