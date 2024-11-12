"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseReportC_1 = require("../controllers/expenseReportC");
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
router.get('/user', authorize_1.UserAuthorized, expenseReportC_1.showUserExpense);
exports.default = router;
