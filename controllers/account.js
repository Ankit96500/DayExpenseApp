import User from '../models/user.js';
import sequelize from '../config/database.js';
import { Sequelize } from 'sequelize';

import JWT from "jsonwebtoken";

import bcrypt from "bcrypt";
const saltRounds = 10;


export async function postSignupUser(req, res, next) {
  const {name,email,password} = req.body;

  // if (!name || !email || !password) {
  //   res.status(400).json({error:"Name, email, and password are required" })
  // }  no need bcos i handle from frontend
  try {
    
    const hashpassword = await bcrypt.hash(password,saltRounds);
    
    const data = await User.create({    
      name : name,
      password : hashpassword,
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
  
  try {
      // first check , given email exist or not
      const user = await User.findOne({
        where:{
          email:email,
        }
      })
     // If the user does not exist
     if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // If the user exists, compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Type correct password" });
    }
    // If both email and password are correct, send the user data as the response
    JWT.sign({userID:user.id,name:user.name},'secretkey',(err,token)=>{
    //   if (token) {
    //     console.log('show token',token);
    // }
      if (err) {
      res.status(500).json({error:"token not generated"})
    }
    return res.status(200).json({token:token});
  });


  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
}






