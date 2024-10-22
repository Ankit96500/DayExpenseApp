import Expense from "../models/expenseM.js";

export const getdata = (req,res)=>{
    // console.log('i am call for get request');
    
    Expense.findAll()
    .then(data =>{
        // console.log('Data Sent To Client',data);
        res.json(data)
    })
    .catch(err =>{
        res.json({"msg":"Sorry Try Again.."})
        // console.log('Not Saved',err);
    })
}

export const adddata = (req,res)=>{
    // console.log(req.body);
    const expense_amount = req.body.expense_amount
    const desc = req.body.desc
    const category = req.body.category
    Expense.create({
        expense_amount:expense_amount,
        desc:desc,
        category:category
    })
    .then(result =>{
        // console.log('D',result);
        res.json({'msg':"ok Data Created.."})
    })
    .catch(err =>{
        res.json({'msg':"Not Created.. Please Check The Fields."})
        // console.log('not Created..',err);
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



