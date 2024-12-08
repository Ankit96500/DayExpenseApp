import User from "../models/user.js"
// import expenseReport from "../models/expensereportM.js";
import Expense from "../models/expenseM.js";
import mongoose from "mongoose";
import moment from "moment";// You can use moment or any date library for date operations


export const showUserExpense = async (req,res) => {
    const today = moment().startOf('day');
    const weekstart = moment().startOf('week');
    const monthstart = moment().startOf('month')
    console.log('--->',req.user._id);
    
    try {
    // query for time period today
   
   // Query for daily expenses
   const daily = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } }, // Match the user
    {
        $lookup: {
            from: "expenses", // Name of the Expense collection in MongoDB
            localField: "_id",
            foreignField: "UserID",
            as: "expenses",
        },
    },
    {
        $project: {
            name: 1,
            total_income: 1,
            total_expense: 1,
            expenses: {
                $filter: {
                    input: "$expenses",
                    as: "expense",
                    cond: {
                        $and: [
                            { $gte: ["$$expense.createdAt", today] },
                            { $lt: ["$$expense.createdAt", moment().endOf('day').toDate()] },
                        ],
                    },
                },
            },
        },
    },
]);
        // Query for weekly expenses
    const weekly = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } }, // Match the user
        {
            $lookup: {
                from: "expenses",
                localField: "_id",
                foreignField: "UserID",
                as: "expenses",
            },
        },
        {
            $project: {
                name: 1,
                total_income: 1,
                total_expense: 1,
                expenses: {
                    $filter: {
                        input: "$expenses",
                        as: "expense",
                        cond: {
                            $and: [
                                { $gte: ["$$expense.createdAt", weekstart] },
                                { $lt: ["$$expense.createdAt", moment().endOf('week').toDate()] },
                            ],
                        },
                    },
                },
            },
        },
    ]);
   // Query for monthly expenses
   const monthly = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } }, // Match the user
    {
        $lookup: {
            from: "expenses",
            localField: "_id",
            foreignField: "UserID",
            as: "expenses",
        },
    },
    {
        $project: {
            name: 1,
            total_income: 1,
            total_expense: 1,
            expenses: {
                $filter: {
                    input: "$expenses",
                    as: "expense",
                    cond: {
                        $and: [
                            { $gte: ["$$expense.createdAt", monthstart] },
                            { $lt: ["$$expense.createdAt", moment().endOf('month').toDate()] },
                        ],
                    },
                },
            },
        },
    },
]);
//-------------------------------------------------------------------------
    console.log('dau=ily: ',daily);
    console.log('weeekly',weekly);
    console.log("monthly:;",weekly);
    
    
    
    let formattedData_daily;
    if (daily.length === 0) {
       formattedData_daily = {}
    }else{

        const userObj_daily = daily[0]
        const expenses_daily = userObj_daily.expensetb || []
        
        
        // total expense for the user
        const totalExpense_daily = userObj_daily.total_expense
        
        //final balance
        const finalBalance_daily =  userObj_daily.total_income - totalExpense_daily 
        
        
        
        // format the data for the client side:
        formattedData_daily = {
            name:userObj_daily.name,
            totalIncome:userObj_daily.total_income,
            totalExpense:userObj_daily.total_expense,
            finalBalance:finalBalance_daily,
            expenses:expenses_daily.map((expense,index)=>({
                "S.no":index+1,
                date:expense.get('date'),
                category:expense.category,
                description:expense.desc,
                amount:expense.expense_amount,
            }))
        };
    }
        

//-----------------------------------------------------------------------------
    let formattedData_weekly;
    if (weekly.length === 0) {
        formattedData_weekly ={}
    } else {
        
        const userObj_weekly = weekly[0]
        const expenses_weekly = userObj_weekly.expensetb || []
        
        // total expense for the user
        const totalExpense_weekly = userObj_weekly.total_expense
        
        //final balance
        const finalBalance_weekly =  userObj_weekly.total_income - totalExpense_weekly 
        
        
        formattedData_weekly = {
            name:userObj_weekly.name,
            totalIncome:userObj_weekly.total_income,
            totalExpense:userObj_weekly.total_expense,
            finalBalance:finalBalance_weekly,
            expenses:expenses_weekly.map((expense,index)=>({
                "S.no":index+1,
                date:expense.get('date'),
                category:expense.category,
                description:expense.desc,
                amount:expense.expense_amount,
            }))
        }
    }

//------------------------------------------------------------------------------
    let formattedData_monthly;
    if (monthly.length === 0) {
        formattedData_monthly={}
    } else {
        
        const userObj_monthly = monthly[0]
        const expenses_monthly = userObj_monthly.expensetb || []
        
        // total expense for the user
        const totalExpense_monthly = userObj_monthly.total_expense
        
        //final balance
        const finalBalance_monthly =  userObj_monthly.total_income - totalExpense_monthly 
    
        formattedData_monthly = {
        name:userObj_monthly.name,
        totalIncome:userObj_monthly.total_income,
        totalExpense:userObj_monthly.total_expense,
        finalBalance:finalBalance_monthly,
        expenses:expenses_monthly.map((expense,index)=>({
            "S.no":index+1,
            date:expense.get('date'),
            category:expense.category,
            description:expense.desc,
            amount:expense.expense_amount,
            }))
        }
    }

    
    // const links = await req.user.getExpensereporttb();
    const links = await expenseReport.find({UserID:req.user});
    console.log("inside the link",links);
    
    const r = []
    
    for (const link of links) {
        r.push(link.rlink)
    }
    
 
    res.status(201).json({
        daily:formattedData_daily,
        weekly:formattedData_weekly,
        monthly:formattedData_monthly,
        links:r,
    })
    

    } catch (error) {
        if (error.name ==='SequelizeDatabaseError') {
            console.log('special error',error.parent);            
        }
        console.log('erroc catch',error);
        
        res.status(401).json({error:error})
    }
} 

