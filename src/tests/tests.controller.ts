import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tests')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Create a test for a course (Teacher only)' })
  @ApiResponse({ status: 201, description: 'Test created' })
  createTest(@Body() dto: CreateTestDto, @CurrentUser('id') teacherId: string) {
    return this.testsService.createTest(dto, teacherId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all tests (Admin only)' })
  findAllTests(@Query() query: PaginationQueryDto) {
    return this.testsService.findAllTests(query);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get tests by course ID' })
  @ApiParam({ name: 'courseId', type: String })
  findTestsByCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.testsService.findTestsByCourse(courseId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test by ID (students see questions without correct answers)' })
  @ApiParam({ name: 'id', type: String })
  findTestById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('role') role: Role,
  ) {
    const includeAnswers = role === Role.TEACHER || role === Role.ADMIN;
    return this.testsService.findTestById(id, includeAnswers);
  }

  @Patch(':id')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Update test (Teacher only — own course)' })
  @ApiParam({ name: 'id', type: String })
  updateTest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.testsService.updateTest(id, dto, teacherId);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete test (Teacher own course / Admin)' })
  @ApiParam({ name: 'id', type: String })
  deleteTest(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.testsService.deleteTest(id, userId, role);
  }

  // ─── Questions ────────────────────────────────────────────────────────────────

  @Post(':testId/questions')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Add a question to a test (Teacher only)' })
  @ApiParam({ name: 'testId', type: String })
  @ApiResponse({ status: 201, description: 'Question added' })
  addQuestion(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Body() dto: AddQuestionDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.testsService.addQuestion(testId, dto, teacherId);
  }

  @Delete('questions/:questionId')
  @Roles(Role.TEACHER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a question (Teacher only — own test)' })
  @ApiParam({ name: 'questionId', type: String })
  deleteQuestion(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.testsService.deleteQuestion(questionId, teacherId);
  }

  // ─── Student test submission ──────────────────────────────────────────────────

  @Post(':testId/submit')
  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit test answers — auto-graded (Student only)' })
  @ApiParam({ name: 'testId', type: String })
  @ApiResponse({ status: 200, description: 'Test graded with score breakdown' })
  @ApiResponse({ status: 409, description: 'Already submitted' })
  @ApiResponse({ status: 403, description: 'Not enrolled in course' })
  submitTest(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Body() dto: SubmitTestDto,
    @CurrentUser('id') studentId: string,
  ) {
    return this.testsService.submitTest(testId, dto, studentId);
  }
}
