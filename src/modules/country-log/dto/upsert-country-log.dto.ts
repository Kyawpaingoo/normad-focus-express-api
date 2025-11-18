import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertCountryLogDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  country_name: string;

  @IsNotEmpty()
  @IsString()
  visa_type: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  entry_date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  exit_date: Date;

  @IsNotEmpty()
  @IsNumber()
  visa_limit_days: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  notify_at?: Date;
}
