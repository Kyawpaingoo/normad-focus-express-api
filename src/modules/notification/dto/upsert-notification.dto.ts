import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  source_type: string;

  @IsNotEmpty()
  @IsNumber()
  source_id: number;

  @IsOptional()
  @IsString()
  title?: string | null;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  notify_at: Date;
}
