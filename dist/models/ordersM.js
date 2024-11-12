"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Step 3: Extend the Sequelize Model class with types for attributes and creation
class Orders extends sequelize_1.Model {
}
Orders.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    paymentId: sequelize_1.DataTypes.STRING,
    orderId: sequelize_1.DataTypes.STRING,
    status: sequelize_1.DataTypes.STRING,
    UserID: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "User",
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    sequelize: database_1.default
});
exports.default = Orders;
