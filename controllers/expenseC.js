import { Sequelize} from "sequelize";
import sequelize from "../config/database.js";
import Expense from "../models/expenseM.js";
import User from "../models/user.js";
import {getS3ObjectUrl,generateFileName} from "../utils/customfun.js"
import {uploadFile} from "../services/awsS3.js"
import mongoose from "mongoose";


export const getdata = async (req,res)=>{
    try {
        //get page and limit for query parametrs --- [pagination code]:
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 4
       
        // calculate the offset (skip items) for pagination
        const offset = (page - 1 ) * limit;

        // Fetch total count of records (without pagination, used for frontend display)
        // const totalItems = await req.user.countExpensetb();
        const userid = req.user._id
        const totalItems = await Expense.countDocuments({UserID:userid});
    
        
        const data = await Expense.find().limit(limit).skip(offset)
        // console.log(' inside the data',data);
        
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

    const {expense_amount,desc,category} = req.body

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
         // Step 1: Create a new expense document
         const expense = await Expense.create(
            [
                {
                    expense_amount: expense_amount,
                    desc: desc,
                    category: category,
                    UserID: req.user._id, // Use the user's ID
                },
            ],
            { session } // Pass the session to include this operation in the transaction
        );
         // Step 2: Update the user's total_expense
        req.user.total_expense += Number(expense_amount);
        await req.user.save({ session }); // Save user document in the same transaction

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Send success response
        res.status(201).json({ msg: "Data Created Successfully.", expense });

    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        session.endSession();

        console.error("Error:", error);
        res.status(500).json({ error: "Failed to add expense. Please try again later." });
    }
}

export const deletedata = async (req,res)=>{
    const id = req.params.id
    console.log(' iside the id',id);
    
    // start session for the transcation
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //step 1: find the expense by id

        const expense = await Expense.findById(id).session(session);
        console.log(' insid ethe expense',expense);
        
        if (!expense) {
            return res.status(404).json({ msg: "Expense not found."});
        }
        // step 2: adjust the user for the total expense
        let user = req.user
        user.total_expense -= Number(expense.expense_amount) 
        // save the  user document in the same transcation
        await user.save({session})

        // step 3: delete the expense document
        await expense.deleteOne(session);

        // step 4: Commit the transaction if everything is successful
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({'msg':"ok Data Deleted.."})
    } catch (error) {
        console.log('errroor',error);
        // rollback the transcation in case of error
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: "Failed to delete expense. Please try again later." });
    }

}

export const downloadReport = async (req,res)=>{
    
    try {
        const expense = await Expense.find({UserID:req.user});
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



