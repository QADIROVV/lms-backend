import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class AddQuestionDto {
  @ApiProperty({ example: 'Which keyword is used to declare a constant in JavaScript?' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    example: ['var', 'let', 'const', 'def'],
    description: 'Array of 2–6 answer options',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: 'const',
    description: 'Must exactly match one of the options',
  })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;
}
