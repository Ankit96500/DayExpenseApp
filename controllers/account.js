import User from "../models/user.js";
import { Sequelize } from "sequelize";
import JWT from "jsonwebtoken";


import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
const saltRounds = 10;

export async function postSignupUser(req, res, next) {
  const { name, email, password } = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, saltRounds);

    const data = new User({
      name: name,
      password: hashpassword,
      email: email,
    });
    await data.save();
    
    res.status(201).json({ data: data });
  } catch (error) {  
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ error: 'Email Must Be Unique' });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export async function postLoginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // first check , given email exist or not
    const user = await User.findOne({
      email:email,
    });
    
    // If the user does not exist
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // If the user exists, compare the provided password with the stored hashed password
    const isPasswordMatch = bcrypt.compare(password, user.password);

    // If the password does not match
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    // If both email and password are correct, send the user data as the response
      JWT.sign({ userID: user.id, name: user.name },process.env.JWT_SECRET_KEY,(err, token) => {
        if (err) {
          res.status(500).json({ error: "token not generated" });
        }
        return res.status(200).json({ token: token });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login" });
  }
}


export async function updateUserIncome(req,res) {
  const income = req.body.income 
  try {
    let user = req.user
    user.total_income = income
    await user.save();
    
    res.status(201).json({data:user.total_income})
  } catch (error) {
    res.status(201).json({error:"not Updated User Income"})
  }
  
}

