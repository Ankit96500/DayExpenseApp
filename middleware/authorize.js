
import User from '../models/user.js';
import JWT  from 'jsonwebtoken';


// check weather the given request is vaild user request or not;
export function UserAuthorized(req,res,next) {
    try {
        const token = req.header('Authorization')
        // verify the token
        const user_ID = JWT.verify(token,'secretkey')
     
        
        User.findByPk(user_ID.userID)
        .then(user=>{
            // console.log(JSON.stringify(user));
            req.user = user
            next();       
        })
        // it pass error to next
        .catch(err=>{throw new Error(err)})
    } catch (error) {
        console.log('not catch by middelware',error); 
        return res.status(401).json({success:false})
    }

}






