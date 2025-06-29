import {Router} from 'express'
import * as expenseController from '../controller/expenseTrackerController'
import { auth } from '../middleware/authMiddleware';

const expenseRouter = Router();

expenseRouter.get('/get-by-paging', auth, expenseController.getByPaging);
expenseRouter.get('/get-by-id/:id/:userId', expenseController.getByID);
expenseRouter.put('/update/:id/:userId', expenseController.updateExpense);
expenseRouter.patch('/soft-delete/:id/:userId', expenseController.softDeleteExpense);
expenseRouter.delete('/hard-delete/:id/:userId', expenseController.hardDeleteExpense);

expenseRouter.post('/insert', expenseController.insertExpense);

export default expenseRouter