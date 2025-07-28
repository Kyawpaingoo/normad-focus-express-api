import { Router } from "express";
import * as meetingScheduleController from '../controller/meetingScheduleController'
import { auth } from "../middleware/authMiddleware";

const meetingScheduleRouter = Router();

meetingScheduleRouter.get('/get-by-paging', auth, meetingScheduleController.getByPaging);
meetingScheduleRouter.get('/get-by-id/:id/:userId', meetingScheduleController.getByID);
meetingScheduleRouter.get('/generate-ics-content/:id/:userId', meetingScheduleController.generateICSContent);
meetingScheduleRouter.put('/update/:id/:userId', meetingScheduleController.updateMeetingSchedule);
meetingScheduleRouter.patch('/soft-delete/:id/:userId', meetingScheduleController.softDeleteMeetingSchedule);
meetingScheduleRouter.delete('/hard-delete/:id/:userId', meetingScheduleController.hardDeleteMeetingSchedule);

meetingScheduleRouter.post('/insert', meetingScheduleController.insertMeetingSchedule);

export default meetingScheduleRouter;
