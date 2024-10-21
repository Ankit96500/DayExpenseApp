import path from 'path';

import { Router } from 'express';

import { postSignupUser } from '../controllers/account.js';

const router = Router();

// /admin/add-product => POST
router.post('/signup-user', postSignupUser);



export default router;
