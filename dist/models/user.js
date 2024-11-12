"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Sequelize } from "sequelize";
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// step 3: define class which extend model and types
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    email: { type: sequelize_1.DataTypes.STRING, unique: true },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    isPremiumUser: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    total_expense: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    total_income: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0
    }
}, {
    freezeTableName: true,
    sequelize: database_1.default,
    modelName: 'User'
});
exports.default = User;
