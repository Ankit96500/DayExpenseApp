import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type:String,
  },
  email:{
    type:String,
    unique:true
  },
  password:{
    type:String,
  },
  isPremiumUser:{
    type:Boolean,
    default:false
  },
  total_expense:{
    type:Number,
    default:0
  },
  total_income:{
    type:Number,
    default:0
  }
});

const User = mongoose.model('user',userSchema)

export default User;
// import { DataTypes, Model } from "sequelize";
// import sequelize from "../config/database.js";

// class User extends Model {}
// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true,
//     },

//     name: { type: DataTypes.STRING, allowNull: true },
//     email: { type: DataTypes.STRING, unique: true },
//     password: {
//       type: DataTypes.STRING,
//     },
//     isPremiumUser :{
//       type:DataTypes.BOOLEAN,
//       defaultValue:false
//     },
//     total_expense:{
//       type:DataTypes.INTEGER,
//       defaultValue : 0
//     },
//     total_income:{
//       type:DataTypes.INTEGER,allowNull:true,defaultValue : 0
//     }
//   },
//   {
//     freezeTableName: true,
//     sequelize,
//   }
// );

