import { Router } from "express";
import * as taskController from "../controller/taskController";
import { auth } from "../middleware/authMiddleware";

const taskRouter = Router();

taskRouter.get('/get-by-view', auth, taskController.getByView);
taskRouter.get('/get-by-id/:id/:userId', taskController.getTaskByID);
taskRouter.put('/update/:id/:userId', taskController.updateTask);
taskRouter.patch('/soft-delete/:id/:userId', taskController.softDeleteTask);
taskRouter.delete('/hard-delete/:id/:userId', taskController.hardDeleteTask);

taskRouter.post('/insert', taskController.createTask);

export default taskRouter