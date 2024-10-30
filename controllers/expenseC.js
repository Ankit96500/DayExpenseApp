import { Sequelize} from "sequelize";
import sequelize from "../config/database.js";
import Expense from "../models/expenseM.js";
import User from "../models/user.js";
import expenseReport from "../models/expensereportM.js";
import {getS3ObjectUrl,generateFileName,uploadFile} from "../utils/customfun.js"

import dotenv from "dotenv"

export const getdata = async (req,res)=>{
    // console.log('inside the requser',req.user.id);

    try {
        const dt = await User.findOne(
            {
                where:{id:req.user.id},
            }
        )
        // console.log('Data >>>>',JSON.stringify(dt));
        const data = await dt.getExpensetb()
        res.status(200).json({data:data,user:dt})
    } catch (error) {
        res.status(404).json({error:"Sorry Try Again.."})
        // console.log('Not Saved',error);   
    }
}

export const adddata = async (req,res)=>{
    // console.log('add data->',req.user.id);
    const userid = req.user.id
    const {expense_amount,desc,category} = req.body
    const t = await sequelize.transaction();
    try {
        await Expense.create({
        expense_amount:expense_amount,
        desc:desc,
        category:category,
        UserID:userid
        },{transaction:t})

        let user =  req.user
        user.total_expense += Number(expense_amount)
        await user.save({transaction:t})
        await t.commit();
        res.status(201).json({'msg':"ok Data Created.."})

    } catch (error) {
        await t.rollback();
        // Log and send error response
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to add expense. Please try again later.' });
    }
}

export const deletedata = async (req,res)=>{
    const t  = await sequelize.transaction();
    const id = req.params.id
    console.log('--------------',req.params);
    try {
        const expense = await Expense.findByPk(id)
        
        if (!expense) {
            return res.status(404).json({ msg: "Expense not found." });
        }

        let user = req.user
        user.total_expense -= Number(expense.expense_amount) 
        await user.save({transaction:t})

        await expense.destroy({transaction:t})

        // Commit the transaction if everything is successful
        await t.commit();

        res.status(201).json({'msg':"ok Data Deleted.."})
    } catch (error) {
        console.log('errroor',error);
        
        await t.rollback();
        res.status(500).json({ error: "Failed to delete expense. Please try again later." });
    }

}

export const downloadReport = async (req,res)=>{
    
    try {
        const expense = await req.user.getExpensetb();
        const stringifiedData = JSON.stringify(expense)
        const fileName = generateFileName()
        
        await uploadFile(stringifiedData,fileName)
        
        const fileURL = getS3ObjectUrl(process.env.AWS_BUCKET,process.env.AWS_REGION,fileName);
        
        const r = await req.user.createExpensereporttb({rlink:fileURL})
       
        res.status(201).json({data:fileURL,success:true})
   
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense. Please try again later." });
    }
}


export const editdata = (req,res)=>{
   

}


export const geteditdata  = (req,res)=>{
  
}



