"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// use full when do deployment
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
// // load routes
const admin_1 = __importDefault(require("./routes/admin"));
const expenseR_1 = __importDefault(require("./routes/expenseR"));
const buyPremiumR_1 = __importDefault(require("./routes/buyPremiumR"));
const premiumFeatureR_1 = __importDefault(require("./routes/premiumFeatureR"));
const resetPasswordR_1 = __importDefault(require("./routes/resetPasswordR"));
const expenseReportR_1 = __importDefault(require("./routes/expenseReportR"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// const accessLogStream = fs.createWriteStream(join(process.cwd(),'access.log'),{flags:'a'});
// middelware setup
app.use(express_1.default.static((0, path_1.join)(process.cwd(), "public")));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// app.use(morgan('combined',{stream:accessLogStream}));
// home url redirection
app.get('/', (req, res) => {
    res.redirect('client/account/login.html');
});
// NOW THE HEADER will AUTOMATICALLY MANAGE BY THE EXPRESS
app.get('/password/resetpassword/axios.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile((0, path_1.join)(process.cwd(), 'public', 'axios.js'));
});
app.get('/password/resetpassword/resetPasswordForm.js', (req, res) => {
    // console.log("reset formjs hit");
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile((0, path_1.join)(process.cwd(), 'public', 'resetPasswordForm.js'));
});
// ROUTES HANDELING
app.use("/buy-premium", buyPremiumR_1.default);
app.use("/admin", admin_1.default);
app.use("/expense", expenseR_1.default);
app.use("/premium-feature", premiumFeatureR_1.default);
app.use("/password", resetPasswordR_1.default);
app.use("/show-expense", expenseReportR_1.default);
// import models
const user_1 = __importDefault(require("./models/user"));
const expenseM_1 = __importDefault(require("./models/expenseM"));
const ordersM_1 = __importDefault(require("./models/ordersM"));
const passwordresetM_1 = __importDefault(require("./models/passwordresetM"));
const database_1 = __importDefault(require("./config/database"));
const expensereportM_1 = __importDefault(require("./models/expensereportM"));
//establish association
// USER <--> Expense
user_1.default.hasMany(expenseM_1.default, {
    foreignKey: "UserID",
    as: "expensetb",
    onDelete: "CASCADE", // IF USER deleted the associative expense will be deleted
});
expenseM_1.default.belongsTo(user_1.default, {
    foreignKey: "UserID",
    as: "usertb",
});
// User <--> Order
user_1.default.hasMany(ordersM_1.default, {
    foreignKey: "UserID",
    as: "orders",
    onDelete: "CASCADE",
});
ordersM_1.default.belongsTo(user_1.default, {
    foreignKey: "UserID",
    as: "usertb",
});
// USER <--> PASSWORD
user_1.default.hasMany(passwordresetM_1.default, {
    foreignKey: "UserID",
    as: "passwordtd",
    onDelete: "CASCADE"
});
passwordresetM_1.default.belongsTo(user_1.default, {
    foreignKey: "UserID",
    as: "usertb"
});
// USER <---> EXPENSE-REPORT
user_1.default.hasMany(expensereportM_1.default, {
    foreignKey: 'UserID',
    as: "expensereporttb",
    onDelete: 'CASCADE'
});
expensereportM_1.default.belongsTo(user_1.default, {
    foreignKey: "UserID",
    as: "usertb"
});
// we ceate user if no user we have and cart also
// Expense.sync({force:true})
// User.sync({alter:true})
database_1.default
    // .sync({force:true})
    .sync()
    .then(() => {
    console.log(`connected db at PORT: ${PORT}`);
    app.listen(PORT);
})
    .catch((err) => {
    console.log(err);
});
