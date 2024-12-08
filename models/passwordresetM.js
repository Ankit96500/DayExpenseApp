import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
    isActive:{
        type:Boolean,
        // required:true
    },
    UserID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }
});

const Password = mongoose.model('password',passwordSchema);

export default Password;
// import sequelize from "../config/database.js";
// import { DataTypes, Model } from "sequelize";

// class Password extends Model{}
//     Password.init({
//         id:{
//             type:DataTypes.UUID,
//             defaultValue:DataTypes.UUIDV4,
//             // autoIncrement:true,// for uuid not neede
//             primaryKey:true,
//             allowNull:false
//         },
//         isActive:{
//             type:DataTypes.BOOLEAN,
//             defaultValue:true,
//             allowNull:false
//         },
//         UserID:{
//             allowNull:true,
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

