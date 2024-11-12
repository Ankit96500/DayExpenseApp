"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Step 3: Extend the Sequelize Model class with types for attributes and creation
class expenseReport extends sequelize_1.Model {
}
// Step 4: Initialize the model with the schema definition
expenseReport.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    rlink: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // This could be `false` if the link is mandatory
    },
    UserID: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "User", // This refers to the User table (foreign key)
            key: "id",
        },
    },
}, {
    sequelize: database_1.default, // The connection instance (imported from your config)
    freezeTableName: true, // This option prevents Sequelize from pluralizing the table name
    tableName: "expenseReport", // Explicitly name the table in the DB
});
exports.default = expenseReport;
