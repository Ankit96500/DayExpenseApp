
import { Router } from 'express';

import {showUserExpense} from '../controllers/expenseReportC';
import { UserAuthorized } from '../middleware/authorize';


const router = Router();

router.get('/user',UserAuthorized,showUserExpense);


export default router;
