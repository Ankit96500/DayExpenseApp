import path from 'path';

import { Router } from 'express';

import {LeaderBoard,getLeaderBoardData} from '../controllers/premiumFeatureC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

// redirect to leader board
router.get("/leaderboard",UserAuthorized,LeaderBoard)

router.get("/get-leaderboard-data",UserAuthorized,getLeaderBoardData)



export default router;
