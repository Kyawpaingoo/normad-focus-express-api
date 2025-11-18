import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CountryLogService } from './country-log.service';
import { NotificationService } from '../notification/notification.service';
import { UpsertCountryLogDto } from './dto/upsert-country-log.dto';
import { UpsertNotificationDto } from '../notification/dto/upsert-notification.dto';
import { sortDirection } from '../../common/types/pagination.types';

@Controller('api/country-log')
export class CountryLogController {
  constructor(
    private readonly countryLogService: CountryLogService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('insert')
  async createCountryLog(@Body() countryLogDto: UpsertCountryLogDto, @Res() res: Response) {
    try {
      const result = await this.countryLogService.insert(countryLogDto);

      if (result.notify_at != null) {
        const notificationDto: UpsertNotificationDto = {
          user_id: result.user_id,
          source_id: result.id,
          source_type: 'Country Log',
          title: 'Visa Expiry Alert',
          message: `Reminder: Your ${result.visa_type} will be seen expired in ${result.exit_date}`,
          notify_at: result.notify_at,
        };

        await this.notificationService.insert(notificationDto);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Country Log created successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('get-by-id/:id/:userId')
  async getCountryLogById(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.countryLogService.getById(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Country log details fetch successfull',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('update/:id/:userId')
  async updateCountryLog(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() countryLogDto: UpsertCountryLogDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.countryLogService.update(id, userId, countryLogDto);

      if (result != null) {
        await this.notificationService.update(result.id, result.notify_at);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Country Log upadted Successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Delete('hard-delete/:id/:userId')
  async deleteCountryLog(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.countryLogService.hardDelete(id, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Country log deleted successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('get-by-paging')
  async getByPaging(@Query() query: any, @Res() res: Response) {
    try {
      const { page, pageSize, userId, sortDir, q } = query;

      const result = await this.countryLogService.getByPaging(
        parseInt(page as string),
        parseInt(pageSize as string),
        parseInt(userId as string),
        sortDir as sortDirection,
        q as string,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Country Log fetched successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
