import Razorpay from "razorpay";
import dotenv from "dotenv";
import Orders from "../models/ordersM.js";
import User from "../models/user.js";

dotenv.config();

export const purchasePremium = async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    instance.orders.create(
      { amount: 2500, currency: "INR", receipt: "Please Visit Again!" },
      (err, order) => {
        if (err) {
          throw new Error(err);
        }
        if (order) {
          // save this order in the database
          Orders.create({
            orderId: order.id,
            status: "Pending",
            UserID: req.user.id,
          })
            .then(() => {
              // console.log("you data saved successfully",result);
              res.status(201).json({ order: order, key_id: instance.key_id });
            })
            .catch((err) => {
              throw new Error(err);
            });
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
    const orderObj = await Orders.findOne({ where: { orderId: order_id } });
    if (!orderObj) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    // Update order with paymentId and status
    await orderObj.update({
      paymentId: payment_id,
      status: "SUCCESSFUL",
    });

    // Update user to become premium user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.update({ isPremiumUser: true });

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
    const orderObj = await Orders.findOne({ where: { orderId: order_id } });
    if (!orderObj) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    // Update order with paymentId and status
    await orderObj.update({
      status: "FAILED",
    });

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
