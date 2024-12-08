import Razorpay from "razorpay";
import dotenv from "dotenv";
import Orders from "../models/ordersM.js";
import User from "../models/user.js";

dotenv.config();

export const purchasePremium = async (req, res) => {
  console.log(' iama calling..');
  
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    instance.orders.create(
      { amount: 150, currency: "INR", receipt: "Please Visit Again!" },
      (err, order) => {
        if (err) {
          console.log(err);
        }
        if (order) {
          // save this order in the database
          const od = new Orders({
            orderId: order.id,
            status: "Pending",
            UserID: req.user,
          })
          od.save();
          if (od) {
            res.status(201).json({ order: order, key_id: instance.key_id });
          }
        }
      }
    );
  } catch (error) {
    console.log("ERROR OCCUR  during creation of order", error);
    res.status(401).json({ error: error });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    // Get order object
    const orderObj = await Orders.findOne({
      orderId:order_id
    });
    if (!orderObj) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    // Update order with paymentId and status
    orderObj.paymentId=payment_id
    orderObj.status = "SUCCESSFUL"
    await orderObj.save();

    // Update user to become premium user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.isPremiumUser = true
    await user.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Transaction Successful",
    });
  } catch (error) {
    console.error("Error in updateTransactionStatus:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const transactionFailed = async (req, res) => {
  try {
    const { order_id } = req.body;

    // Get order object
    const orderObj = await Orders.findOne({ orderId: order_id });
    if (!orderObj) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    // Update order with paymentId and status
    orderObj.status = "FAILED"
    await orderObj.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Transaction Failed.",
    });
  } catch (error) {
    console.error("Error in TransactionFailed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
