import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { MeetingService } from './meeting.service';
import { UpsertMeetingDto } from './dto/upsert-meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { sortDirection } from '../../common/types/pagination.types';

@Controller('api/meeting-schedule')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('insert')
  @UseGuards(JwtAuthGuard)
  async insertMeetingSchedule(@Body() meetingDto: UpsertMeetingDto, @Res() res: Response) {
    try {
      const result = await this.meetingService.insert(meetingDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Meeting Schedule inserted successfully',
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
  @UseGuards(JwtAuthGuard)
  async getByID(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.meetingService.getById(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Meeting details fetched successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('generate-ics-content/:id/:userId')
  @UseGuards(JwtAuthGuard)
  async generateICSContent(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const meeting = await this.meetingService.getById(id, userId);
      const icsContent = await this.meetingService.generateICS(meeting);

      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename="meeting-${meeting.id}.ics"`);
      return res.status(HttpStatus.OK).send(icsContent);
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('update/:id/:userId')
  @UseGuards(JwtAuthGuard)
  async updateMeetingSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() meetingDto: UpsertMeetingDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.meetingService.update(id, userId, meetingDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Meeting Schedule updated successfully',
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
  @UseGuards(JwtAuthGuard)
  async getByPaging(@Query() query: any, @Res() res: Response) {
    try {
      const { page, pageSize, userId, sortDir, q } = query;
      const result = await this.meetingService.getbyPaging(
        parseInt(page as string),
        parseInt(pageSize as string),
        parseInt(userId as string),
        sortDir as sortDirection,
        q as string,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Meeting Schedule Paging fetched successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Patch('soft-delete/:id/:userId')
  @UseGuards(JwtAuthGuard)
  async softDeleteMeetingSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.meetingService.softDelete(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Meeting Schedule deleted successfully',
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
  @UseGuards(JwtAuthGuard)
  async hardDeleteMeetingSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.meetingService.hardDelete(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Meeting Schedule deleted successfully',
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
