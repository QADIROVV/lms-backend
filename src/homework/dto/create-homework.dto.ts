import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Variables and Data Types Assignment' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Create a JS file demonstrating all primitive data types.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z' })
  @IsDateString()
  deadline: string;

  @ApiProperty({ example: 'uuid-of-course' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}
