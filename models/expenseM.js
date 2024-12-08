import mongoose from "mongoose";

const expenseScheme = new mongoose.Schema({
    expense_amount:{
        type:Number
    },
    desc:{
        type:String
    },
    category:{
        type:String
    },
    UserID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
})

const Expense = mongoose.model("expense",expenseScheme)
export default Expense;

// import { DataTypes, Model } from "sequelize";
// import sequelize from "../config/database.js";

// class Expense extends Model {}
// Expense.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },

//     expense_amount: { type: DataTypes.INTEGER, allowNull: true },

//     desc: { type: DataTypes.STRING, allowNull: true },

//     category: { type: DataTypes.STRING, allowNull: true },

//     UserID: {
//       allowNull:false,
//       type: DataTypes.INTEGER,
//       references: {
//         model: "User",
//         key: "id",
//       },
//     },
//   },
//   {
//     freezeTableName: true,
//     sequelize,
//   }
// );

