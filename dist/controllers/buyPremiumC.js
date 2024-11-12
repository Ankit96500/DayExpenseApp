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
exports.transactionFailed = exports.updateTransactionStatus = exports.purchasePremium = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const ordersM_1 = __importDefault(require("../models/ordersM"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
const purchasePremium = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var instance = new razorpay_1.default({
            key_id: process.env.KEY_ID || 'not exist',
            key_secret: process.env.KEY_SECRET || "not exist",
        });
        instance.orders.create({ amount: 200, currency: "INR", receipt: "Please Visit Again!" }, (err, order) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({ error: 'Error creating order' });
            }
            if (order) {
                // save this order in the database
                try {
                    if (!req.user) {
                        res.status(401).json({ error: 'Unauthorized' });
                        return;
                    }
                    yield ordersM_1.default.create({
                        orderId: order.id,
                        status: "Pending",
                        UserID: req.user.id,
                    });
                    res.status(201).json({ order: order, key_id: process.env.KEY_ID });
                }
                catch (error) {
                    res.status(500).json({ error: 'Error saving order to database' });
                }
            }
        }));
    }
    catch (error) {
        res.status(401).json({ error: error });
    }
});
exports.purchasePremium = purchasePremium;
const updateTransactionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, payment_id } = req.body;
        // Get order object
        const orderObj = yield ordersM_1.default.findOne({ where: { orderId: order_id } });
        if (!orderObj) {
            res
                .status(404)
                .json({ success: false, message: "Order not found" });
            return;
        }
        // Update order with paymentId and status
        yield orderObj.update({
            paymentId: payment_id,
            status: "SUCCESSFUL",
        });
        // Update user to become premium user
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = yield user_1.default.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        yield user.update({ isPremiumUser: true });
        // Return success response
        res.status(201).json({
            success: true,
            message: "Transaction Successful",
        });
        return;
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
exports.updateTransactionStatus = updateTransactionStatus;
const transactionFailed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.body;
        // Get order object
        const orderObj = yield ordersM_1.default.findOne({ where: { orderId: order_id } });
        if (!orderObj) {
            res
                .status(404)
                .json({ success: false, message: "Order not found" });
            return;
        }
        // Update order with paymentId and status
        yield orderObj.update({
            status: "FAILED",
        });
        // Return success response
        res.status(201).json({
            success: true,
            message: "Transaction Failed.",
        });
        return;
    }
    catch (error) {
        // console.error("Error in TransactionFailed:", error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
exports.transactionFailed = transactionFailed;
