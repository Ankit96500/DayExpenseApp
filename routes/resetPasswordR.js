
import { Router } from 'express';

import {resetForgetPassword} from '../controllers/passwordResetC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

// redirect to leader board
router.post("/forgotpassword",UserAuthorized,resetForgetPassword)


export default router;
