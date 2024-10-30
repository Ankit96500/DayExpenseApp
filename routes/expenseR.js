import path from 'path';

import { Router } from 'express';

import {getdata,adddata,deletedata,downloadReport} from '../controllers/expenseC.js';
import { UserAuthorized } from '../middleware/authorize.js';


const router = Router();

router.get('/get_dt',UserAuthorized,getdata)

router.post('/add_dt',UserAuthorized,adddata)

router.delete('/delete_dt/:id',UserAuthorized,deletedata)

router.get('/download-report',UserAuthorized,downloadReport)



export default router;
