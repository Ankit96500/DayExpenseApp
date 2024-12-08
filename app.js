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

const PORT = 3000 
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


// home url
app.get('',(req,res)=>{
  res.redirect('/client/account/login.html')
})

// load routes
import adminRoutes from "./routes/admin.js";
import expenseRoutes from "./routes/expenseR.js";
import buyPremiumRoutes from "./routes/buyPremiumR.js"
import premiumFeature from "./routes/premiumFeatureR.js"
import password from "./routes/resetPasswordR.js"
// import showexpense from "./routes/expenseReportR.js"


app.use("/buy-premium", buyPremiumRoutes);
app.use("/admin", adminRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium-feature",premiumFeature)
app.use("/password",password)
// app.use("/show-expense",showexpense)

// // import models
import User from "./models/user.js";
import Expense from "./models/expenseM.js";
import Orders from "./models/ordersM.js";
import Password from "./models/passwordresetM.js"
// import expenseReport from "./models/expensereportM.js"

import connectMongoDB from "./config/database.js";

connectMongoDB(()=>{

  app.listen(PORT);
  console.log(`connected db at PORT: ${PORT}`);
})

  