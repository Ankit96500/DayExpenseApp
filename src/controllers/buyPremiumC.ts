import Razorpay from "razorpay";
import dotenv from "dotenv";
import Orders from "../models/ordersM";
import User from "../models/user";
import { Request, Response } from "express";

dotenv.config();


// Explicitly augment the Express Request type in this file
declare module 'express-serve-static-core'{
  interface Request{
    user?:User;
  }
}


export const purchasePremium = async (req:Request, res:Response) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID || 'not exist',
      key_secret: process.env.KEY_SECRET || "not exist",
    });

    instance.orders.create(
      { amount: 200, currency: "INR", receipt: "Please Visit Again!" },
      async (err, order) => {
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
            await Orders.create({
              orderId: order.id,
              status: "Pending",
              UserID: req.user.id,
            })
            res.status(201).json({ order: order, key_id: process.env.KEY_ID });
          } catch (error) {
            res.status(500).json({ error: 'Error saving order to database' });
          }
        }
      }
    );
  } catch (error) {
    res.status(401).json({ error: error });
  }
};

export const updateTransactionStatus = async (req:Request, res:Response) => {
  try {
    const { order_id, payment_id } = req.body;

    // Get order object
    const orderObj = await Orders.findOne({ where: { orderId: order_id } });
    if (!orderObj) {
        res
        .status(404)
        .json({ success: false, message: "Order not found" });
        return;
    }
    // Update order with paymentId and status
    await orderObj.update({
      paymentId: payment_id,
      status: "SUCCESSFUL",
    });


    // Update user to become premium user
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await user.update({ isPremiumUser: true });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Transaction Successful",
    });
    return;
  } catch (error) {
      res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const transactionFailed = async (req:Request, res:Response) => {
  try {
    const { order_id } = req.body;

    // Get order object
    const orderObj = await Orders.findOne({ where: { orderId: order_id } });
    if (!orderObj) {
      res
        .status(404)
        .json({ success: false, message: "Order not found" });
      return;
      }
    // Update order with paymentId and status
    await orderObj.update({
      status: "FAILED",
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Transaction Failed.",
    });
    return;
  } catch (error) {
    // console.error("Error in TransactionFailed:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
