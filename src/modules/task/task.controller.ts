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
import { TaskService } from './task.service';
import { NotificationService } from '../notification/notification.service';
import { UpsertTaskDto } from './dto/upsert-task.dto';
import { UpsertNotificationDto } from '../notification/dto/upsert-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { sortDirection, ViewMode } from '../../common/types/pagination.types';

@Controller('api/task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('insert')
  async createTask(@Body() taskDto: UpsertTaskDto, @Res() res: Response) {
    try {
      const result = await this.taskService.insert(taskDto);

      if (result.notify_at != null) {
        const notificationDto: UpsertNotificationDto = {
          user_id: result.user_id,
          source_type: 'Task',
          source_id: result.id,
          title: result.title,
          message: `Reminder: You have a task called ${result.title} to do at ${result.start_date}`,
          notify_at: result.notify_at,
        };
        await this.notificationService.insert(notificationDto);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Task created successfully',
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
  async getTaskByID(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.taskService.getByID(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Task details fetched successfully',
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
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() taskDto: UpsertTaskDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.taskService.update(id, userId, taskDto);

      if (result != null) {
        await this.notificationService.update(result.id, result.notify_at);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Task updated successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('get-by-view')
  @UseGuards(JwtAuthGuard)
  async getByView(@Query() query: any, @Res() res: Response) {
    try {
      const {
        viewMode = 'list',
        cursor,
        limit = '20',
        userId,
        year,
        month,
        sortDir,
        q,
        status,
        priority,
      } = query;

      const limitNum = parseInt(limit as string);
      if (limitNum > 100) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Limit cannot exceed 100 items',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const view = viewMode as ViewMode;
      const result = await this.taskService.getTasksByView(
        view,
        cursor as string || null,
        limitNum,
        parseInt(userId as string),
        parseInt(year as string),
        parseInt(month as string),
        sortDir as sortDirection,
        q as string,
        status as string,
        priority as string,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: `Tasks fetched successfully for ${view} view`,
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
  async softDeleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.taskService.softDelete(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Task deleted successfully',
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
  async hardDeleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.taskService.hardDelete(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Task deleted successfully',
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
