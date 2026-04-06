import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsUUID, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class TestAnswerDto {
  @ApiProperty({ example: 'uuid-of-question' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'const' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SubmitTestDto {
  @ApiProperty({
    type: [TestAnswerDto],
    example: [
      { questionId: 'uuid-of-question-1', answer: 'const' },
      { questionId: 'uuid-of-question-2', answer: 'object' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TestAnswerDto)
  answers: TestAnswerDto[];
}
