import path from 'path';

import { Router } from 'express';

import {purchasePremium, transactionFailed, updateTransactionStatus} from '../controllers/buyPremiumC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

router.get('/purchase',UserAuthorized,purchasePremium)

router.post('/update-transaction-status',UserAuthorized,updateTransactionStatus)

router.post("/transaction-failed",UserAuthorized,transactionFailed)



export default router;
