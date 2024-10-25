import JWT from "jsonwebtoken";

export const resetForgetPassword = async (req,res)=>{
    try {
        console.log('upcomg request  ---->',req);
        console.log('upcomg user validate',req.user);
        
        res.status(201).json({"msg":"hi you hit the server..."})
    } catch (error) {
        console.log('>>>',error);
        res.status(401).json({error:"sorry some server error occur"})
        
    }
    
}

