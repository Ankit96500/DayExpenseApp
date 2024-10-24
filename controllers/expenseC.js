import { Sequelize } from "sequelize";
import Expense from "../models/expenseM.js";
import User from "../models/user.js";

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

export const adddata = (req,res)=>{
    // console.log('add data->',req.user.id);
    const userid = req.user.id
    const {expense_amount,desc,category} = req.body

    Expense.create({
        expense_amount:expense_amount,
        desc:desc,
        category:category,
        UserID:userid
    })
    .then(()=>{
        // update  total expense in user model  
        let user = req.user
        user.total_expense += Number(expense_amount)
        user.save().then(()=>{
            res.json({'msg':"ok Data Created.."})
        })
        .catch(err=>{throw new Error(err);
        })

    })
    .catch(error =>{
        res.status(401).json({error:"Not Created.. Please Check The Fields."})
    })

    // res.json({'id':"ok..jkj"})
}

export const deletedata = (req,res)=>{
    // console.log('--------------',req.params);
    const id = req.params.id
    Expense.findByPk(id)
    .then(expense =>{
        expense.destroy()
        res.json({'msg':"ok Data Deleted.."})
    })
    .catch(err =>{
        res.json({'msg':"Not  Deleted.."})
        // console.log('not Deleted..',err);
    })

}

export const editdata = (req,res)=>{
   

}


export const geteditdata  = (req,res)=>{
  
}



