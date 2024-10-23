// import { Sequelize } from "sequelize";
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, unique: true },
    password: {
      type: DataTypes.STRING,
      // set(value) {
      //   this.setDataValue("password", hash(value));
      // },
    },
    isPremiumUser :{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  },
  {
    freezeTableName: true,
    sequelize,
  }
);

export default User;
