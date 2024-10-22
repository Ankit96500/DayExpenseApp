import path from 'path';

import { Router } from 'express';

import {getdata,adddata,deletedata} from '../controllers/expenseC.js';

const router = Router();

router.get('/get_dt',getdata)

router.post('/add_dt',adddata)

router.delete('/delete_dt/:id',deletedata)



export default router;
