
import sequelize from "../config/database";
import { DataTypes, Model ,Optional} from "sequelize";

// Step 1: Define the interface for the attributes of the expenseReport
interface PasswordAttributes {
    id: number;
    isActive:boolean | null;
    UserID: number;
    createdAt?:Date;
    updatedAt?:Date;
  }
  
// Step 2: Define another interface for the optional attributes during creation

interface PasswordCreationAttributes extends Optional<PasswordAttributes, "id"> {}
  // Step 3: Extend the Sequelize Model class with types for attributes and creation
  
class Password extends Model<PasswordAttributes,PasswordCreationAttributes> implements PasswordAttributes{
    public id!: number;
    public isActive!:boolean |null;
    public UserID!: number;
    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;

}
    Password.init({
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            // autoIncrement:true,// for uuid not neede
            primaryKey:true,
            allowNull:false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:true
        },
        UserID:{
            allowNull:true,
            type: DataTypes.INTEGER,
            references:{
                model:"User",
                key:'id'
            }
        }
    },{
        freezeTableName:true,
        sequelize
    })

export default Password
