

import { Router } from 'express';

import {purchasePremium, transactionFailed, updateTransactionStatus} from '../controllers/buyPremiumC';
import { UserAuthorized } from '../middleware/authorize';


const router = Router();

router.get('/purchase',UserAuthorized,purchasePremium)

router.post('/update-transaction-status',UserAuthorized,updateTransactionStatus)

router.post("/transaction-failed",UserAuthorized,transactionFailed)



export default router;
