"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passwordResetC_1 = require("../controllers/passwordResetC");
const router = (0, express_1.Router)();
// redirect to leader board
router.post("/forgotpassword", passwordResetC_1.resetForgetPassword);
router.get("/resetpassword/:token", passwordResetC_1.resetRequestPassword);
router.post("/reset-password-done/:token", passwordResetC_1.resetPasswordDone);
exports.default = router;
