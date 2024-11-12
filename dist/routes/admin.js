"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_1 = require("../controllers/account");
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
// /admin/create user => POST
router.post('/signup-user', account_1.postSignupUser);
// /admin/loginuser => POST
router.post('/login-user', account_1.postLoginUser);
// admin update income => post
router.post('/update-income/', authorize_1.UserAuthorized, account_1.updateUserIncome);
exports.default = router;
