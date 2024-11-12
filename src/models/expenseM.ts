import { DataTypes, Model,Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";   //import user model

// step 1: define the attribut interface
interface ExpenseAttributes{
  id:number;
  expense_amount:number | null;
  desc:string |null;
  category:string | null;
  UserID:number;
  createdAt?:Date;
  updatedAt?:Date;
}

//step 2: define a interface for (optional fields for creation)
interface ExpenseCreationAttribute extends Optional<ExpenseAttributes,"id" | "createdAt" |"updatedAt">{}

//step 3: define the class  extending model with types argument
class Expense extends Model<ExpenseAttributes,ExpenseCreationAttribute> implements ExpenseAttributes{
  public id!:number;
  public expense_amount!: number|null; // <-- Ensure this property is defined
  public desc!: string|null; // The '!' means these properties are non-nullable
  public category!: string | null;
  public UserID!: number;
  //timestamp
  public createdAt!: Date;
  public updatedAt!: Date;
}
Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    expense_amount: { type: DataTypes.INTEGER, allowNull: true ,defaultValue:0},

    desc: { type: DataTypes.STRING, allowNull: true ,defaultValue:"no text"},

    category: { type: DataTypes.STRING, allowNull: true ,defaultValue:"others"},

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
