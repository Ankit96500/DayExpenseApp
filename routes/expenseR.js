import path from 'path';

import { Router } from 'express';

import {getdata,adddata,deletedata} from '../controllers/expenseC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

router.get('/get_dt',UserAuthorized,getdata)

router.post('/add_dt',UserAuthorized,adddata)

router.delete('/delete_dt/:id',deletedata)



export default router;
