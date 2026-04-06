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
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Homework')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  // ─── Homework endpoints ───────────────────────────────────────────────────────

  @Post()
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Create homework for a course (Teacher only)' })
  @ApiResponse({ status: 201, description: 'Homework created' })
  createHomework(
    @Body() dto: CreateHomeworkDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.homeworkService.createHomework(dto, teacherId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all homework (Admin only)' })
  findAllHomework(@Query() query: PaginationQueryDto) {
    return this.homeworkService.findAllHomework(query);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get homework by course ID' })
  @ApiParam({ name: 'courseId', type: String })
  findHomeworkByCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.homeworkService.findHomeworkByCourse(courseId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get homework by ID' })
  @ApiParam({ name: 'id', type: String })
  findHomeworkById(@Param('id', ParseUUIDPipe) id: string) {
    return this.homeworkService.findHomeworkById(id);
  }

  @Patch(':id')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Update homework (Teacher only — own course)' })
  @ApiParam({ name: 'id', type: String })
  updateHomework(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateHomeworkDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.homeworkService.updateHomework(id, dto, teacherId);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete homework (Teacher own course / Admin)' })
  @ApiParam({ name: 'id', type: String })
  deleteHomework(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.homeworkService.deleteHomework(id, userId, role);
  }

  // ─── Submission endpoints ─────────────────────────────────────────────────────

  @Post(':homeworkId/submit')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Submit homework (Student only)' })
  @ApiParam({ name: 'homeworkId', type: String })
  @ApiResponse({ status: 201, description: 'Homework submitted' })
  @ApiResponse({ status: 409, description: 'Already submitted' })
  @ApiResponse({ status: 403, description: 'Not enrolled / deadline passed' })
  submitHomework(
    @Param('homeworkId', ParseUUIDPipe) homeworkId: string,
    @Body() dto: SubmitHomeworkDto,
    @CurrentUser('id') studentId: string,
  ) {
    return this.homeworkService.submitHomework(homeworkId, dto, studentId);
  }

  @Get(':homeworkId/submissions')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get submissions for a homework (Teacher own course / Admin)' })
  @ApiParam({ name: 'homeworkId', type: String })
  findSubmissionsByHomework(
    @Param('homeworkId', ParseUUIDPipe) homeworkId: string,
    @CurrentUser('id') teacherId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.homeworkService.findSubmissionsByHomework(homeworkId, teacherId, query);
  }

  @Get('submissions/my')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Get student's own submissions" })
  findMySubmissions(
    @CurrentUser('id') studentId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.homeworkService.findMySubmissions(studentId, query);
  }
}
