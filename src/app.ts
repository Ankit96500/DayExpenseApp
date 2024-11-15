import { join } from "path";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
// import morgan from "morgan";
import fs from "fs";

// use full when do deployment
import helmet from "helmet";
import compression from "compression";


// // load routes
import adminRoutes from "./routes/admin";
import expenseRoutes from "./routes/expenseR";
import buyPremiumRoutes from "./routes/buyPremiumR"
import premiumFeature from "./routes/premiumFeatureR"
import password from "./routes/resetPasswordR"
import showexpense from "./routes/expenseReportR"


dotenv.config()
const PORT = process.env.PORT || 3000 
const app = express();
// const accessLogStream = fs.createWriteStream(join(process.cwd(),'access.log'),{flags:'a'});


// middelware setup
app.use(express.static(join(process.cwd(),"public")))
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression())
// app.use(morgan('combined',{stream:accessLogStream}));


// home url redirection
app.get('/',(req:Request,res:Response)=>{
  res.redirect('/client/account/login.html')
})


// NOW THE HEADER will AUTOMATICALLY MANAGE BY THE EXPRESS
app.get('/password/resetpassword/axios.js', (req:Request, res:Response) => {
  
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(join(process.cwd(), 'public', 'axios.js'));
});

app.get('/password/resetpassword/resetPasswordForm.js', (req:Request, res:Response) => {
  // console.log("reset formjs hit");
  
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(join(process.cwd(), 'public', 'resetPasswordForm.js'));
});



// ROUTES HANDELING
app.use("/buy-premium", buyPremiumRoutes);
app.use("/admin", adminRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium-feature",premiumFeature)
app.use("/password",password)
app.use("/show-expense",showexpense)

// import models
import User from "./models/user";
import Expense from "./models/expenseM";
import Orders from "./models/ordersM";
import Password from "./models/passwordresetM"
import sequelize from "./config/database";
import expenseReport from "./models/expensereportM"


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
  .then(() => {
    console.log(`connected db at PORT: ${PORT}`);
    app.listen(PORT);
  })
  .catch((err:Error) => {
    console.log(err);
  });


  