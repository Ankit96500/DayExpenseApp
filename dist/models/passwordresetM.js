"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Step 3: Extend the Sequelize Model class with types for attributes and creation
class Password extends sequelize_1.Model {
}
Password.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        // autoIncrement:true,// for uuid not neede
        primaryKey: true,
        allowNull: false
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true
    },
    UserID: {
        allowNull: true,
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
exports.default = Password;
