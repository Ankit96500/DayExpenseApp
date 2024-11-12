

import { Router } from 'express';

import {LeaderBoard,getLeaderBoardData} from '../controllers/premiumFeatureC';
import { UserAuthorized } from '../middleware/authorize';


const router = Router();

// redirect to leader board
router.get("/leaderboard",UserAuthorized,LeaderBoard)

router.get("/get-leaderboard-data",UserAuthorized,getLeaderBoardData)



export default router;
