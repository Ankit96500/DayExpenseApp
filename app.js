import { join } from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
// use full when do deployment
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import fs from "fs";


const app = express();


// const accessLogStream = fs.createWriteStream(join(process.cwd(),'access.log'),{flags:'a'});


// Serve static files from the 'public' directory
app.use(express.static(join(process.cwd(),"public")))

// connect 3rd parties
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression())
// app.use(morgan('combined',{stream:accessLogStream}));


// load routes
import adminRoutes from "./routes/admin.js";
import expenseRoutes from "./routes/expenseR.js";
import buyPremiumRoutes from "./routes/buyPremiumR.js"
import premiumFeature from "./routes/premiumFeatureR.js"
import password from "./routes/resetPasswordR.js"
import showexpense from "./routes/expenseReportR.js"


app.use("/buy-premium", buyPremiumRoutes);
app.use("/admin", adminRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium-feature",premiumFeature)
app.use("/password",password)
app.use("/show-expense",showexpense)

// import models
import User from "./models/user.js";
import Expense from "./models/expenseM.js";
import Orders from "./models/ordersM.js";
import Password from "./models/passwordresetM.js"
import sequelize from "./config/database.js";
import expenseReport from "./models/expensereportM.js"
import { Stream } from "stream";


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

// USER <--> PASSWORD
User.hasMany(Password,{
  foreignKey:"UserID",
  as:"passwordtd",
  onDelete:"CASCADE"
})

Password.belongsTo(User,{
  foreignKey:"UserID",
  as:"usertb"
})

// USER <---> EXPENSE-REPORT
User.hasMany(expenseReport,{
  foreignKey:'UserID',
  as:"expensereporttb",
  onDelete:'CASCADE'
})

expenseReport.belongsTo(User,{
  foreignKey:"UserID",
  as:"usertb"
})


// we ceate user if no user we have and cart also
// Expense.sync({force:true})
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


