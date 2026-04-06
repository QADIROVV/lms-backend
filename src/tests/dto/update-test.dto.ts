import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTestDto {
  @ApiPropertyOptional({ example: 'Advanced JavaScript Quiz' })
  @IsOptional()
  @IsString()
  title?: string;
}
