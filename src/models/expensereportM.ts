import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Step 1: Define the interface for the attributes of the expenseReport
interface ExpenseReportAttributes {
  id: number;
  rlink: string;
  UserID: number;
  createdAt?:Date;
  updatedAt?:Date;
}

// Step 2: Define another interface for the optional attributes during creation
// We make the 'id' field optional because it will be auto-incremented by the database
interface ExpenseReportCreationAttributes extends Optional<ExpenseReportAttributes, "id"> {}
// Step 3: Extend the Sequelize Model class with types for attributes and creation

class expenseReport extends Model<ExpenseReportAttributes, ExpenseReportCreationAttributes> implements ExpenseReportAttributes {
  public id!: number; //  The ! operator tells TypeScript that these fields will always be set after the record is created.
  public rlink!: string;
  public UserID!: number;

  // These are the timestamp fields that Sequelize automatically generates
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Step 4: Initialize the model with the schema definition
expenseReport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    rlink: {
      type: DataTypes.STRING,
      allowNull: true, // This could be `false` if the link is mandatory
    },
    UserID: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "User", // This refers to the User table (foreign key)
        key: "id",
      },
    },
  },
  {
    sequelize, // The connection instance (imported from your config)
    freezeTableName: true, // This option prevents Sequelize from pluralizing the table name
    tableName: "expenseReport", // Explicitly name the table in the DB
  }
);

export default expenseReport;
