import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Expense extends Model {}
Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    expense_amount: { type: DataTypes.INTEGER, allowNull: true },

    desc: { type: DataTypes.STRING, allowNull: true },

    category: { type: DataTypes.STRING, allowNull: true },

    UserID: {
      allowNull:false,
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    sequelize,
  }
);

export default Expense;
