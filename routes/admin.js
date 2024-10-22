import path from 'path';

import { Router } from 'express';

import { postSignupUser ,postLoginUser} from '../controllers/account.js';

const router = Router();

// /admin/create user => POST
router.post('/signup-user', postSignupUser);


// /admin/loginuser => POST
router.post('/login-user', postLoginUser);



export default router;
