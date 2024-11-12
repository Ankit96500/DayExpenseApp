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
exports.resetPasswordDone = exports.resetRequestPassword = exports.resetForgetPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passwordresetM_1 = __importDefault(require("../models/passwordresetM"));
// nodemail --> is a SMTP service
// use gmail --> is a SMTP server
const resetForgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // configure the SMTP
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, //true for port 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    // console.log('reqest',req.body);
    const { email } = req.body;
    try {
        // check if valid user
        const user = yield user_1.default.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).json({ error: 'Enter Valid Email ID' });
            return;
        }
        // generate token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET_KEY || "notexist", { expiresIn: '1h' });
        // {expiresIn:process.env.RESET_TOKEN_EXPIRATION}
        //create reset link
        const resetLink = `http://localhost:3000/password/resetpassword/${token}`;
        //send the mail
        const mailOption = {
            from: process.env.SMTP_USER, //sender email addresss
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}`,
            html: `<p>You requested a password reset. Please click the following link to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>`,
        };
        // here we saved user-password creation in database
        yield passwordresetM_1.default.create({ UserID: user.id });
        try {
            const result = yield transporter.sendMail(mailOption);
            // console.log("Message sent: %s", result.messageId);
            // res.status(201).json({data:"Please Check Your Registered Gmail"})
            res.status(201).json({ data: result.envelope.to });
        }
        catch (err) {
            throw new Error(err);
        }
    }
    catch (error) {
        res.status(401).json({ error: "sorry some server error occur" });
    }
});
exports.resetForgetPassword = resetForgetPassword;
// (Handle the Token and Update Password) {give on GMAIL }
const resetRequestPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params; // The token passed from the URL
    // console.log('i AM CALLED',token);
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "notexist");
        // Type guard to check if decoded is a JwtPayload
        if (typeof decoded === "string") {
            res.status(400).json({ error: "Invalid token format" });
            return;
        }
        const userId = decoded.id;
        // Find the user by their ID
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: 'Invalid token or user not found' });
            return;
        }
        // render password reset form to user
        const resetpasswordform = path_1.default.join(process.cwd(), 'public', 'resetPasswordForm.html');
        res.setHeader('Content-Type', 'text/html'); // HTML page
        res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME-type sniffing
        res.sendFile(resetpasswordform);
        // res.status(200).json({ message: 'Password reset successfully.'});
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Handle expired token
            res.status(401).json({
                error: 'Password reset token has expired. Please request a new password reset link.'
            });
        }
        else {
            res.status(400).json({ error: 'Token is invalid or has expired.' });
        }
    }
});
exports.resetRequestPassword = resetRequestPassword;
// user password change done or not
const resetPasswordDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params; // The token passed from the URL
    const { newPassword } = req.body; // The new password from the request body
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "notexist");
        console.log('checked decoded', decoded);
        // Type guard to check if decoded is a JwtPayload
        if (typeof decoded === "string") {
            res.status(400).json({ error: "Invalid token format" });
            return;
        }
        const userId = decoded.id;
        // Find the user by their ID
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: 'Invalid token or user not found' });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        if (!hashedPassword) {
            res.status(404).json({ error: 'Invalid token or hashedpassword not found' });
            return;
        }
        // // Update the user's password
        user.password = hashedPassword;
        yield user.save();
        // Optionally: Mark the reset password as inactive in the Password model
        yield passwordresetM_1.default.update({ isActive: false }, { where: { UserID: userId } });
        res.status(200).json({ message: 'Password reset successfully.' });
    }
    catch (error) {
        res.status(400).json({ error: 'Token is invalid or has expired.' });
    }
});
exports.resetPasswordDone = resetPasswordDone;
