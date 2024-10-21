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



