
import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

class Password extends Model{}
    Password.init({
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            // autoIncrement:true,// for uuid not neede
            primaryKey:true,
            allowNull:false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:false
        },
        UserID:{
            allowNull:true,
            type: DataTypes.INTEGER,
            references:{
                model:"User",
                key:'id'
            }
        }
    },{
        freezeTableName:true,
        sequelize
    })

export default Password
