import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateHomeworkDto {
  @ApiPropertyOptional({ example: 'Updated Homework Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-01-15T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
