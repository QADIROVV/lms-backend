import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class SubmitHomeworkDto {
  @ApiProperty({ example: 'Here is my solution: const name = "Alice"; ...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'https://github.com/student/homework-solution' })
  @IsOptional()
  @IsUrl()
  fileUrl?: string;
}
