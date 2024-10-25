import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import nodemailer from "nodemailer";

// nodemail --> is a SMTP service
// use gmail --> is a SMTP server

export const resetForgetPassword = async (req,res)=>{
    // configure the SMTP
    
    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:587,
        secure:false, //true for port 465, false for other ports
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    

    console.log('reqest',req.body);
    const {email} = req.body
    try {
        // check if valid user
        const user = await User.findOne({where:{ email:email }});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // generate token
        const token = JWT.sign({id:user.id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.RESET_TOKEN_EXPIRATION})

        //create reset link
        const resetLink = "http://localhost:3000/password/resetpassword"

        //send the mail
        const mailOption = {
            from:process.env.SMTP_USER,  //sender email addresss
            to:user.email,
            subject:'Password Reset Request',
            text:`You requested a password reset. Please click the following link to reset your password: ${resetLink}`,
            html: `<p>You requested a password reset. Please click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
        }

        try {
            const result = await transporter.sendMail(mailOption)
            console.log("Message sent: %s", result.messageId);
            res.status(201).json({"msg":"hi you hit the server..."})
        } catch (err) {
            throw new Error(err);
        
        }

    } catch (error) {
        console.log('>>>',error);
        res.status(401).json({error:"sorry some server error occur"})
        
    }
    
}



// (Handle the Token and Update Password)
export const resetRequestPassword = async (req,res)=>{
    console.log('i AM CALLED');
    
}

