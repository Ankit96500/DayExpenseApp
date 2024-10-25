
import { Router } from 'express';

import {resetForgetPassword,resetRequestPassword} from '../controllers/passwordResetC.js';


const router = Router();

// redirect to leader board
router.post("/forgotpassword",resetForgetPassword)

router.get("/resetpassword",resetRequestPassword)


export default router;
