import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Expense = sequelize.define('expense',{

    id :{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true,allowNull:false},
    
    expense_amount:{type:DataTypes.INTEGER,allowNull:true},
    
    desc:{type:DataTypes.STRING,allowNull:true},
    
    category:{type:DataTypes.STRING,allowNull:true},

});

export default Expense;