
import { Router } from 'express';

import {showUserExpense} from '../controllers/expenseReportC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

router.get('/user',UserAuthorized,showUserExpense);


export default router;
