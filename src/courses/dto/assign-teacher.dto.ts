import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignTeacherDto {
  @ApiProperty({ example: 'uuid-of-teacher' })
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;
}
