"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const buyPremiumC_1 = require("../controllers/buyPremiumC");
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
router.get('/purchase', authorize_1.UserAuthorized, buyPremiumC_1.purchasePremium);
router.post('/update-transaction-status', authorize_1.UserAuthorized, buyPremiumC_1.updateTransactionStatus);
router.post("/transaction-failed", authorize_1.UserAuthorized, buyPremiumC_1.transactionFailed);
exports.default = router;
