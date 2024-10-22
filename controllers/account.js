import User from '../models/user.js';
import sequelize from '../config/database.js';
import { Sequelize } from 'sequelize';



export async function postSignupUser(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const data = await User.create({    
      name : name,
      password : password,
      email : email,
    })

    res.status(201).json({'data':data}) 

  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({error:"User Already Exist"})
      
    } else {
      res.status(500).json({error: 'Something went wrong' });
    }
  }
}

export async function postLoginUser(req,res) {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(`email: ${email}   password: ${password} `);
  
  try {
      // first check , given email exist or not
      const user = await User.findOne({
        where:{
          email:email,
        }
      })
      // if user not exist
      if (!user) {
        // console.log('user not exists');     
        res.status(404).json({error:"user does not exist"});
      }
      // if password not match
      if (user.password !== password) {
        res.status(401).json({error:"Type Correct Password"});
      }
      //if both email and password exist:
      res.status(200).json({'data':user})
    } catch (error) {
    
  }


}





