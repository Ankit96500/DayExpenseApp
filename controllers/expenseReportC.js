import User from "../models/user.js"
import Expense from "../models/expenseM.js"
import sequelize from "sequelize";
import moment from "moment";// You can use moment or any date library for date operations


export const showUserExpense = async (req,res) => {
    const today = moment().startOf('day');
    const weekstart = moment().startOf('week');
    const monthstart = moment().startOf('month')
    
    try {
    // query for time period today
   
    const daily = await User.findAll({
        where:{id:req.user.id},
        attributes:['name','total_income','total_expense'],
        include:[
            {
                model:Expense,
                as:"expensetb",
                attributes:[
                    'id','expense_amount','desc','category',[
                        sequelize.fn('DATE',sequelize.col('expensetb.createdAt')),'date'
                    ]
                ],
                // where:{
                //     createdAt:{
                //         [sequelize.Op.between]:[today,moment().endOf('day')],        
                //     }
                // },
            },
            
        ],
    });

     // query for time period weekly
    const weekly = await User.findAll({
        where:{id:req.user.id},
        attributes:['name','total_income','total_expense'],
        include:[
            {
                model:Expense,
                as:"expensetb",
                attributes:[
                    'id','expense_amount','desc','category',[
                        sequelize.fn('DATE',sequelize.col('expensetb.createdAt')),'date'
                    ]
                ],
                where:{
                    createdAt:{
                        [sequelize.Op.between]:[weekstart,moment().endOf('week')],
                    }
                },
            },
            
        ],
    });

    // query for time period monthly
    const monthly = await User.findAll({
        where:{id:req.user.id},
        attributes:['name','total_income','total_expense'],
        include:[
            {
                model:Expense,
                as:"expensetb",
                attributes:[
                    'id','expense_amount','desc','category',[
                        sequelize.fn('DATE',sequelize.col('expensetb.createdAt')),'date'
                    ]
                ],
                where:{
                    createdAt:{
                        [sequelize.Op.between]:[monthstart,moment().endOf('month')],
                    }
                },
            },
            
        ],
    });

//-------------------------------------------------------------------------
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

    
    const links = await req.user.getExpensereporttb();
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

