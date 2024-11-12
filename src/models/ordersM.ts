
import sequelize from "../config/database";
import { DataTypes, Model,Optional } from "sequelize";



// Step 1: Define the interface for the attributes of the expenseReport
interface OrderAttributes {
    id: number;
    paymentId: string;
    orderId: string;
    status: string;
    UserID: number;
    createdAt?:Date;
    updatedAt?:Date;
  }
  
// Step 2: Define another interface for the optional attributes during creation

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"|"paymentId"> {}
  // Step 3: Extend the Sequelize Model class with types for attributes and creation
  

class Orders extends Model<OrderAttributes,OrderCreationAttributes> implements OrderAttributes{
    public id!:number;
    public paymentId!:string;
    public orderId!:string;
    public status!:string;
    public UserID!:number;
    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}
    Orders.init({
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        paymentId:DataTypes.STRING,
        orderId:DataTypes.STRING,
        status:DataTypes.STRING,
        UserID:{
            allowNull:false,
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

export default Orders
