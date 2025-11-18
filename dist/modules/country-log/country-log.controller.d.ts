import { Response } from 'express';
import { CountryLogService } from './country-log.service';
import { NotificationService } from '../notification/notification.service';
import { UpsertCountryLogDto } from './dto/upsert-country-log.dto';
export declare class CountryLogController {
    private readonly countryLogService;
    private readonly notificationService;
    constructor(countryLogService: CountryLogService, notificationService: NotificationService);
    createCountryLog(countryLogDto: UpsertCountryLogDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getCountryLogById(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCountryLog(id: number, userId: number, countryLogDto: UpsertCountryLogDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCountryLog(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getByPaging(query: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
