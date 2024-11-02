
import User from '../models/user.js';
import JWT  from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

// check weather the given request is vaild user request or not;
export async function UserAuthorized(req,res,next) {
    try {
        const token = req.header('Authorization')
        
        // verify the token
        const user_ID = JWT.verify(token,process.env.JWT_SECRET_KEY)
     
        const user = await User.findByPk(user_ID.userID)
        req.user = user
    
        next();       

    } catch (error) {
        return res.status(401).json({success:false,error:error})
    }

}






