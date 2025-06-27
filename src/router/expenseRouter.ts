import {Router} from 'express'
import * as expenseController from '../controller/expenseTrackerController'

const expenseRouter = Router();

expenseRouter.get('/get-by-id/:id/:userId', expenseController.getByID);
expenseRouter.put('/update/:id/:userId', expenseController.updateExpense);
expenseRouter.delete('/soft-delete/:id/:userId', expenseController.softDeleteExpense);
expenseRouter.delete('/hard-delete/:id/:userId', expenseController.hardDeleteExpense);
expenseRouter.get('/get-by-paging', expenseController.getByPaging);
expenseRouter.post('/insert', expenseController.insertExpense);

export default expenseRouter