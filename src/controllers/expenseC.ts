
import sequelize from "../config/database";
import Expense from "../models/expenseM";
import {getS3ObjectUrl,generateFileName} from "../utils/customfun"
import {uploadFile} from "../services/awsS3"
import { Request, Response, } from "express";
import User from "../models/user";
import { json } from "stream/consumers";

// Explicitly augment the Express Request type in this file
declare module 'express-serve-static-core'{
    interface Request{
      user?:User;
    }
  }
  
  
export const getdata = async (req:Request,res:Response)=>{
    
    const qpage = typeof req.query.page === 'string' ? req.query.page : "1"
    const qlimit = typeof req.query.limit === 'string' ? req.query.limit : "4" 
  
    try {
        //get page and limit for query parametrs --- [pagination code]:
        const page = parseInt(qpage)
        const limit = parseInt(qlimit) 
       
        // calculate the offset (skip items) for pagination
        const offset = (page - 1 ) * limit;

        // Fetch total count of records (without pagination, used for frontend display)
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
          }
        const totalItems = await req.user.countExpensetb();
    
        // Fetch the data with pagination (using offset and limit)
        const data = await req.user.getExpensetb({
            limit:limit,offset:offset
        })

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalItems / limit);
    
        // Respond with paginated data, current page info, and total pages
        res.status(200).json({
            data:data,
            currentPage:page,
            totalItems:totalItems,
            totalPages:totalPages,
            user:req.user
        })
    } catch (error:any) {
        res.status(401).json({error:"DB Sorry Try Again.."})
    }
}

export const adddata = async (req:Request,res:Response)=>{
    
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const userid:number = req.user.id
    
    interface check{expense_amount:number,desc:string,category:string}
    const {expense_amount,desc,category}:check = req.body
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

    } catch (error:any) {
        await t.rollback();
        // Log and send error response
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to add expense. Please try again later.' });
    }
}

export const deletedata = async (req:Request,res:Response)=>{
    const t  = await sequelize.transaction();
    const id = req.params.id
    // console.log('--------------',req.params);
    try {
        const expense = await Expense.findByPk(id)
        
        if (!expense) {
            res.status(404).json({ msg: "Expense not found." });
            return;
        }
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        let user = req.user
        // user.total_expense -= Number(expense.expense_amount) 
        user.total_expense -= expense.get('expense_amount') as number;
        await user.save({transaction:t})

        await expense.destroy({transaction:t})

        // Commit the transaction if everything is successful
        await t.commit();

        res.status(201).json({'msg':"ok Data Deleted.."})
    } catch (error:any) {
        await t.rollback();
        res.status(500).json({ error: "Failed to delete expense. Please try again later." });
    }

}

export const downloadReport = async (req:Request,res:Response)=>{
    
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const expense = await req.user.getExpensetb();
        const stringifiedData = JSON.stringify(expense)
        
        const fileName = generateFileName()
        
        const bufferData = Buffer.from(stringifiedData);
        await uploadFile(bufferData, fileName);
        
        const fileURL = getS3ObjectUrl(process.env.AWS_BUCKET || 'notexist',process.env.AWS_REGION||"notexist",fileName);
        
        await req.user.createExpensereporttb({
            rlink:fileURL, 
            UserID: req.user.id, // Add the UserID field
            })
       
        res.status(201).json({data:fileURL,success:true})
   
    } catch (error:any) {
        res.status(500).json({ error: "Failed To Download Report ! Check Network" });
    }
}


// export const editdata = (req,res)=>{ }

// export const geteditdata  = (req,res)=>{ }



