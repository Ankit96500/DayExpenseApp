import JWT,{JwtPayload} from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import User from "../models/user";
import nodemailer from "nodemailer";
import Password from "../models/passwordresetM";
import { Request, Response } from "express";

// nodemail --> is a SMTP service
// use gmail --> is a SMTP server

export const resetForgetPassword = async (req:Request,res:Response)=>{
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
    

    // console.log('reqest',req.body);
    const {email} = req.body
    try {
        // check if valid user
        const user = await User.findOne({where:{ email:email }});
        if (!user) {
            res.status(404).json({ error: 'Enter Valid Email ID' });
            return;
        }
        // generate token
        const token = JWT.sign({id:user.id},process.env.JWT_SECRET_KEY||"notexist",{expiresIn:'1h'})
        // {expiresIn:process.env.RESET_TOKEN_EXPIRATION}
        //create reset link
        const resetLink = `http://localhost:3000/password/resetpassword/${token}`

        //send the mail
        const mailOption = {
            from:process.env.SMTP_USER,  //sender email addresss
            to:user.email,
            subject:'Password Reset Request',
            text:`You requested a password reset. Please click the following link to reset your password: ${resetLink}`,
            
            html: `<p>You requested a password reset. Please click the following link to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>`,
        }

        // here we saved user-password creation in database
        await Password.create({UserID:user.id})

        try {
            const result = await transporter.sendMail(mailOption)
            // console.log("Message sent: %s", result.messageId);
            // res.status(201).json({data:"Please Check Your Registered Gmail"})
            res.status(201).json({data:result.envelope.to})
        } catch (err:any) {
            throw new Error(err);
        
        }

    } catch (error:any) {
        res.status(401).json({error:"sorry some server error occur"})
        
    }
    
}


// (Handle the Token and Update Password) {give on GMAIL }
export const resetRequestPassword = async (req:Request,res:Response)=>{
    const { token } = req.params; // The token passed from the URL
    // console.log('i AM CALLED',token);
    try {
        // Verify the token
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY ||"notexist");
        
        // Type guard to check if decoded is a JwtPayload
        if (typeof decoded === "string") {
            res.status(400).json({ error: "Invalid token format" });
            return;
        }

        const userId = (decoded as JwtPayload).id;
        
        // Find the user by their ID
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: 'Invalid token or user not found'});
            return;
        }

        // render password reset form to user
        const resetpasswordform  = path.join(process.cwd(),'public','resetPasswordForm.html')
        res.setHeader('Content-Type', 'text/html');  // HTML page
        res.setHeader('X-Content-Type-Options', 'nosniff');  // Prevent MIME-type sniffing
        
        res.sendFile(resetpasswordform);
        // res.status(200).json({ message: 'Password reset successfully.'});
    } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
            // Handle expired token
            
            res.status(401).json({
                error: 'Password reset token has expired. Please request a new password reset link.'
            });
        } else {
            res.status(400).json({ error: 'Token is invalid or has expired.' });
        }
    }

}


// user password change done or not
export const resetPasswordDone = async (req:Request,res:Response)=>{
    const { token } = req.params; // The token passed from the URL
    const { newPassword } = req.body; // The new password from the request body
    
    try {
        // Verify the token
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY|| "notexist");

        console.log('checked decoded',decoded);
        
        // Type guard to check if decoded is a JwtPayload
        if (typeof decoded === "string") {
            res.status(400).json({ error: "Invalid token format" });
            return;
        }
    
        const userId = (decoded as JwtPayload).id;

        // Find the user by their ID
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: 'Invalid token or user not found' });
            return;
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        if (!hashedPassword) {
            res.status(404).json({ error: 'Invalid token or hashedpassword not found' });
            return;
        }
        
        // // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Optionally: Mark the reset password as inactive in the Password model
        await Password.update({ isActive: false }, { where: { UserID: userId } });

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error:any) {
        res.status(400).json({ error: 'Token is invalid or has expired.' });
    }
   

}

