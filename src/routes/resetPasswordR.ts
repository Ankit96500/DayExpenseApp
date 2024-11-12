
import { Router } from 'express';

import {resetForgetPassword,resetRequestPassword,resetPasswordDone} from '../controllers/passwordResetC';


const router = Router();

// redirect to leader board
router.post("/forgotpassword",resetForgetPassword)

router.get("/resetpassword/:token",resetRequestPassword)

router.post("/reset-password-done/:token",resetPasswordDone)


export default router;
