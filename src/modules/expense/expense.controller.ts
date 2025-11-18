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
import { ExpenseService } from './expense.service';
import { UpsertExpenseDto } from './dto/upsert-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { sortDirection } from '../../common/types/pagination.types';

@Controller('api/expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('insert')
  @UseGuards(JwtAuthGuard)
  async insertExpense(@Body() expenseDto: UpsertExpenseDto, @Res() res: Response) {
    try {
      const result = await this.expenseService.insert(expenseDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Expense inserted successfully',
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
      const result = await this.expenseService.getExpenseByID(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Expense details fetched successfully',
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
  @UseGuards(JwtAuthGuard)
  async updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() expenseDto: UpsertExpenseDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.expenseService.updateExpense(id, userId, expenseDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Expense updated successfully',
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
      const { page, pageSize, userId, year, month, sortDir, q, category, type } = query;

      const result = await this.expenseService.getByPaging(
        parseInt(page as string),
        parseInt(pageSize as string),
        parseInt(userId as string),
        parseInt(year as string),
        parseInt(month as string),
        sortDir as sortDirection,
        q as string,
        category as string,
        type as string,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Expense Paging fetched successfully',
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
  async softDeleteExpense(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.expenseService.softDeleteExpense(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Expense deleted successfully',
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
  async hardDeleteExpense(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.expenseService.hardDeleteExpense(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        msg: 'Expense deleted successfully',
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
