import Expense from "../models/expenseM.js";
import Sequelize from 'sequelize';
import User from "../models/user.js";


// premiummemebership features

export const LeaderBoard = async (req,res)=>{
    try {
        res.status(201).json({data:"fetch leader borad data"})
    } catch (error) {
      res.status(401).json({error:error})
    }
}


export const getLeaderBoardData =  async (req,res)=>{
      try {
        const data = await User.findAll({
          attributes:[ 
            'name','total_expense'
          ],
          order:[['total_expense','ASC']]
        })

        const ldata = data.map((user,index)=>({
          'S.no':index+1,
          name:user.name,
          total_expense:user.total_expense 
        }))
        
        // console.log('--->',JSON.stringify(ldata));
        res.status(201).json({data:ldata})
        
    } catch (error) {
      console.log('err---',error);
      
      res.status(401).json({error:error})
    }
}

