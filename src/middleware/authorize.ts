
import User from '../models/user';
import JWT  from 'jsonwebtoken';
import dotenv from "dotenv";
import { Request, Response ,NextFunction} from "express";
dotenv.config();


// Explicitly augment the Express Request type in this file
declare module 'express-serve-static-core'{
  interface Request{
    user?:User;
  }
}
// check weather the given request is vaild user request or not;

export async function UserAuthorized(req:Request, res:Response, next:NextFunction) {
    try {
      const token = req.header('Authorization');
      if (!token) {
        res.status(401).json({ success: false, error: 'Unauthorized request. No token provided.' });
        return;
      }
  
      const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY || 'default') as { userID: string };
      const user = await User.findByPk(decodedToken.userID);
      
      if (!user) {
        res.status(401).json({ success: false, error: 'Unauthorized request. Invalid token.' });
        return;
      }
      // console.log('user coming: ',user);
      
      req.user = user;  // You can now safely set req.user because of the type extension
      next();
    } catch (error:any) {    
      res.status(401).json({ success: false, error: 'Token verification failed.' });
      return;
    }
  }
  






