import path from 'path';

import { Router } from 'express';

import {purchasePremium, transactionFailed, updateTransactionStatus,LeaderBoard,getLeaderBoardData} from '../controllers/buyPremiumC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

router.get('/purchase',UserAuthorized,purchasePremium)

router.post('/update-transaction-status',UserAuthorized,updateTransactionStatus)

router.post("/transaction-failed",UserAuthorized,transactionFailed)

// all premium memeber ship features
// redirect to leader board
router.get("/leaderboard",UserAuthorized,LeaderBoard)

router.get("/get-leaderboard-data",UserAuthorized,getLeaderBoardData)



export default router;
