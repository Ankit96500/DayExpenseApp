"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
//step 3: define the class  extending model with types argument
class Expense extends sequelize_1.Model {
}
Expense.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    expense_amount: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    desc: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "no text" },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "others" },
    UserID: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "User",
            key: "id",
        },
    },
}, {
    freezeTableName: true,
    sequelize: database_1.default,
});
exports.default = Expense;
