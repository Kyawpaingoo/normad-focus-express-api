import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export class UpsertTaskDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  due_date: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  notify_at?: Date;
}
