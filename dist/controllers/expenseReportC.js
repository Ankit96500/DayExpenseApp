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
exports.showUserExpense = void 0;
const user_1 = __importDefault(require("../models/user"));
const expenseM_1 = __importDefault(require("../models/expenseM"));
const sequelize_1 = __importDefault(require("sequelize"));
const moment_1 = __importDefault(require("moment")); // You can use moment or any date library for date operations
const showUserExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, moment_1.default)().startOf('day');
    const weekstart = (0, moment_1.default)().startOf('week');
    const monthstart = (0, moment_1.default)().startOf('month');
    try {
        // query for time period today
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const daily = yield user_1.default.findAll({
            where: { id: req.user.id },
            attributes: ['name', 'total_income', 'total_expense'],
            include: [
                {
                    model: expenseM_1.default,
                    as: "expensetb",
                    attributes: [
                        'id', 'expense_amount', 'desc', 'category', [
                            sequelize_1.default.fn('DATE', sequelize_1.default.col('expensetb.createdAt')), 'date'
                        ]
                    ],
                    // where:{
                    //     createdAt:{
                    //         [sequelize.Op.between]:[today,moment().endOf('day')],        
                    //     }
                    // },
                },
            ],
        });
        // query for time period weekly
        const weekly = yield user_1.default.findAll({
            where: { id: req.user.id },
            attributes: ['name', 'total_income', 'total_expense'],
            include: [
                {
                    model: expenseM_1.default,
                    as: "expensetb",
                    attributes: [
                        'id', 'expense_amount', 'desc', 'category', [
                            sequelize_1.default.fn('DATE', sequelize_1.default.col('expensetb.createdAt')), 'date'
                        ]
                    ],
                    where: {
                        createdAt: {
                            [sequelize_1.default.Op.between]: [weekstart, (0, moment_1.default)().endOf('week')],
                        }
                    },
                },
            ],
        });
        // query for time period monthly
        const monthly = yield user_1.default.findAll({
            where: { id: req.user.id },
            attributes: ['name', 'total_income', 'total_expense'],
            include: [
                {
                    model: expenseM_1.default,
                    as: "expensetb",
                    attributes: [
                        'id', 'expense_amount', 'desc', 'category', [
                            sequelize_1.default.fn('DATE', sequelize_1.default.col('expensetb.createdAt')), 'date'
                        ]
                    ],
                    where: {
                        createdAt: {
                            [sequelize_1.default.Op.between]: [monthstart, (0, moment_1.default)().endOf('month')],
                        }
                    },
                },
            ],
        });
        //-------------------------------------------------------------------------
        let formattedData_daily;
        if (daily.length === 0) {
            formattedData_daily = {};
        }
        else {
            const userObj_daily = daily[0];
            const expenses_daily = userObj_daily.expensetb || [];
            // total expense for the user
            const totalExpense_daily = userObj_daily.total_expense;
            //final balance
            const finalBalance_daily = userObj_daily.total_income - totalExpense_daily;
            // format the data for the client side:
            formattedData_daily = {
                name: userObj_daily.name,
                totalIncome: userObj_daily.total_income,
                totalExpense: userObj_daily.total_expense,
                finalBalance: finalBalance_daily,
                expenses: expenses_daily.map((expense, index) => ({
                    "S.no": index + 1,
                    date: expense.get('date'),
                    category: expense.category,
                    description: expense.desc,
                    amount: expense.expense_amount,
                }))
            };
        }
        //-----------------------------------------------------------------------------
        let formattedData_weekly;
        if (weekly.length === 0) {
            formattedData_weekly = {};
        }
        else {
            const userObj_weekly = weekly[0];
            const expenses_weekly = userObj_weekly.expensetb || [];
            // total expense for the user
            const totalExpense_weekly = userObj_weekly.total_expense;
            //final balance
            const finalBalance_weekly = userObj_weekly.total_income - totalExpense_weekly;
            formattedData_weekly = {
                name: userObj_weekly.name,
                totalIncome: userObj_weekly.total_income,
                totalExpense: userObj_weekly.total_expense,
                finalBalance: finalBalance_weekly,
                expenses: expenses_weekly.map((expense, index) => ({
                    "S.no": index + 1,
                    date: expense.get('date'),
                    category: expense.category,
                    description: expense.desc,
                    amount: expense.expense_amount,
                }))
            };
        }
        //------------------------------------------------------------------------------
        let formattedData_monthly;
        if (monthly.length === 0) {
            formattedData_monthly = {};
        }
        else {
            const userObj_monthly = monthly[0];
            const expenses_monthly = userObj_monthly.expensetb || [];
            // total expense for the user
            const totalExpense_monthly = userObj_monthly.total_expense;
            //final balance
            const finalBalance_monthly = userObj_monthly.total_income - totalExpense_monthly;
            formattedData_monthly = {
                name: userObj_monthly.name,
                totalIncome: userObj_monthly.total_income,
                totalExpense: userObj_monthly.total_expense,
                finalBalance: finalBalance_monthly,
                expenses: expenses_monthly.map((expense, index) => ({
                    "S.no": index + 1,
                    date: expense.get('date'),
                    category: expense.category,
                    description: expense.desc,
                    amount: expense.expense_amount,
                }))
            };
        }
        const links = yield req.user.getExpensereporttb();
        const r = [];
        for (const link of links) {
            r.push(link.rlink);
        }
        res.status(201).json({
            daily: formattedData_daily,
            weekly: formattedData_weekly,
            monthly: formattedData_monthly,
            links: r,
        });
    }
    catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            console.log('special error', error.parent);
        }
        // console.log('erroc catch',error);
        res.status(401).json({ error: error });
    }
});
exports.showUserExpense = showUserExpense;
