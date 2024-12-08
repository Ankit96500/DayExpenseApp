import mongoose, { Mongoose } from "mongoose"

const orderSchema = new mongoose.Schema({
    paymentId:{type:String},
    orderId:{type:String},
    status:{type:String},
    UserID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }    
});
const Orders = mongoose.model("order",orderSchema);

export default Orders;


// import sequelize from "../config/database.js";
// import { DataTypes, Model } from "sequelize";

// class Orders extends Model{}
//     Orders.init({
//         id:{
//             type:DataTypes.INTEGER,
//             autoIncrement:true,
//             primaryKey:true,
//             allowNull:false
//         },
//         paymentId:DataTypes.STRING,
//         orderId:DataTypes.STRING,
//         status:DataTypes.STRING,
//         UserID:{
//             allowNull:false,
//             type: DataTypes.INTEGER,
//             references:{
//                 model:"User",
//                 key:'id'
//             }
//         }
//     },{
//         freezeTableName:true,
//         sequelize
//     })

