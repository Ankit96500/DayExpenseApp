import { Sequelize} from "sequelize";
import sequelize from "../config/database.js";
import Expense from "../models/expenseM.js";
import User from "../models/user.js";
import {getS3ObjectUrl,generateFileName} from "../utils/customfun.js"
import {uploadFile} from "../services/awsS3.js"


export const getdata = async (req,res)=>{
    try {
        //get page and limit for query parametrs --- [pagination code]:
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 4
       
        // calculate the offset (skip items) for pagination
        const offset = (page - 1 ) * limit;

        // Fetch total count of records (without pagination, used for frontend display)
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
    } catch (error) {
        res.status(401).json({error:"Sorry Try Again.."})
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
        console.log('stringfiee dat',stringifiedData);
        
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



