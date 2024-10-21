// import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: {
    type: DataTypes.STRING,
    // set(value) {
    //   this.setDataValue("password", hash(value));
    // },
  },
});

export default User;
