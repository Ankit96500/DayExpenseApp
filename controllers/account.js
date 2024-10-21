import { where } from 'sequelize';
import User from '../models/user.js';



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

    res.json({'data':data}) 

  } catch (error) {
    console.log('-->',error);
  }
}



