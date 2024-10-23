import { join } from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
console.log('env---',process.env.KEY_SECRET);


const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());

// import models
import User from "./models/user.js";
import Expense from "./models/expenseM.js";
import Orders from "./models/ordersM.js";
import sequelize from "./config/database.js";


// load routes
import adminRoutes from "./routes/admin.js";
import expenseRoutes from "./routes/expenseR.js";
import buyPremiumRoutes from "./routes/buyPremiumR.js"

app.use("/buy-premium", buyPremiumRoutes);
app.use("/admin", adminRoutes);
app.use("/expense", expenseRoutes);




//establish association
// USER <--> Expense
User.hasMany(Expense, {
  foreignKey: "UserID",
  as: "expensetb",
  onDelete: "CASCADE", // IF USER deleted the associative expense will be deleted
});
Expense.belongsTo(User, {
  foreignKey: "UserID",
  as: "usertb",
});

// User <--> Order
User.hasMany(Orders,{
  foreignKey:"UserID",
  as:"orders",
  onDelete:"CASCADE",
})

Orders.belongsTo(User,{
  foreignKey:"UserID",
  as:"usertb",
})



// we ceate user if no user we have and cart also
// Orders.sync({force:true})
// User.sync({alter:true})
sequelize
  // .sync({force:true})
  .sync()
  .then((res) => {
    console.log("connected db");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
