import User from "../models/user";
import { Request, Response } from "express";
import JWT from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import sequelize from "sequelize";
const saltRounds = 10;

// Explicitly augment the Express Request type in this file
declare module 'express-serve-static-core'{
  interface Request{
    user?:User;
  }
}


export async function postSignupUser(req:Request, res:Response):Promise<void> {
  interface check{name:string,email:string,password:any}
  
  const { name, email, password }:check = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, saltRounds);

    const data = await User.create({
      name: name,
      password: hashpassword,
      email: email,
    });

    res
    .status(201)
    .json({data:data})
  } catch (error:any) {  
    if (error instanceof sequelize.UniqueConstraintError) {
      res.status(400).json({ error: 'Email Must Be Unique' });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export async function postLoginUser(req:Request, res:Response):Promise<void> {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // first check , given email exist or not
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    // If the user does not exist
    if (!user) {
      res.status(404).json({ error: "User does not exist" });
      return;
    }

    // If the user exists, compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match
    if (!isPasswordMatch) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }
    // If both email and password are correct, send the user data as the response
      JWT.sign({ userID: user.id, name: user.name },process.env.JWT_SECRET_KEY || 'not exist',(err: any, token: any) => {
        if (err) {
          res.status(500).json({ error: "token not generated" });
        }
        res.status(200).json({ token: token });
      }
    );
  } catch (error:any) {
    res.status(500).json({ error: "An error occurred during login" });
  }
}


export async function updateUserIncome(req:Request,res:Response):Promise<void>{

  const income:number = parseInt(req.body.income) || 0
  
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let user = req.user
    if (!user) {
      res.status(400).json({ error: "User not found." });
      return;
    }
    user.total_income = income
    user.save();
    
    res.status(201).json({data:user.total_income})
  } catch (error) {
    res.status(201).json({error:"not Updated User Income"})
  }
  
}

