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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  @ApiResponse({ status: 201, description: 'Course created' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Paginated list of courses' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get('my-courses')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: "Get teacher's own courses" })
  findMyCourses(
    @CurrentUser('id') teacherId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.coursesService.findByTeacher(teacherId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/students')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get students enrolled in a course (Teacher/Admin)' })
  @ApiParam({ name: 'id', type: String })
  getCourseStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') teacherId: string,
    @CurrentUser('role') role: Role,
    @Query() query: PaginationQueryDto,
  ) {
    const effectiveTeacherId = role === Role.ADMIN ? id : teacherId;
    return this.coursesService.getCourseStudents(id, effectiveTeacherId, query);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a course (Admin or assigned Teacher)' })
  @ApiParam({ name: 'id', type: String })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.coursesService.update(id, dto, userId, userRole);
  }

  @Patch(':id/assign-teacher')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Assign a teacher to a course (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  assignTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTeacherDto,
  ) {
    return this.coursesService.assignTeacher(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a course (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
