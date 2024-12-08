// import mongoose from "mongoose";

// const expenseReportSchema = new mongoose.Schema({
//     rlink:{
//         type:String
//     },
//     UserID:{
//         type:mongoose.Schema.ObjectId,
//         ref:"User",
//         required:true
//     }

// })
// const expenseReport = mongoose.model("expensereport",expenseReportSchema);
// export default expenseReport;
// import { DataTypes, Model } from "sequelize";
// import sequelize from "../config/database.js";

// class expenseReport extends Model {}
// expenseReport.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },

//     rlink: { type: DataTypes.STRING},

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

