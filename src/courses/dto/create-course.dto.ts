import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, IsUUID, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to JavaScript' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Learn JavaScript from scratch with hands-on exercises.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 30, description: 'Duration in days' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'uuid-of-teacher' })
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;
}
