import { Router } from "express";
import * as countryLogCountroller from '../controller/countryLogController';

const countryLogRouter = Router();

countryLogRouter.get('/get-by-paging', countryLogCountroller.getByPaging);
countryLogRouter.get('/get-by-id/:id/:userId', countryLogCountroller.getCountryLogById);
countryLogRouter.put('/update/:id/:userId', countryLogCountroller.updateCountryLog);
countryLogRouter.delete('delete/:id/:userId', countryLogCountroller.deleteCountryLog);

countryLogRouter.post('/insert', countryLogCountroller.createCountryLog);

export default countryLogRouter;