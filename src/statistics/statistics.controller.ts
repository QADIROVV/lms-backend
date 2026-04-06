import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Statistics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('platform')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get platform-wide statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Total users, courses, enrollments, test performance',
  })
  getPlatformStats() {
    return this.statisticsService.getPlatformStats();
  }

  @Get('teacher/:teacherId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher dashboard statistics (Teacher/Admin)' })
  @ApiParam({ name: 'teacherId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Courses taught, enrollments, student performance',
  })
  getTeacherStats(
    @Param('teacherId', ParseUUIDPipe) teacherId: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: Role,
  ) {
    return this.statisticsService.getTeacherStats(teacherId, requesterId, requesterRole);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary:
      'Get student personal statistics — enrollments, submissions, test scores',
  })
  @ApiParam({ name: 'studentId', type: String })
  @ApiResponse({ status: 200, description: 'Student stats with recent results' })
  getStudentStats(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: Role,
  ) {
    return this.statisticsService.getStudentStats(studentId, requesterId, requesterRole);
  }

  @Get('course/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get detailed statistics for a course (Teacher/Admin)' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Active/dropped students, average score, content counts',
  })
  getCourseStats(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.statisticsService.getCourseStats(courseId, userId, userRole);
  }

  @Get('course/:courseId/leaderboard')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get test score leaderboard for a course' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Ranked list of students by best test score',
  })
  getCourseLeaderboard(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.statisticsService.getCourseLeaderboard(courseId, userId, userRole);
  }

  @Get('my-stats')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Get the current student's own statistics" })
  @ApiResponse({ status: 200, description: 'Current student personal stats' })
  getMyStats(
    @CurrentUser('id') studentId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.statisticsService.getStudentStats(studentId, studentId, role);
  }

  @Get('my-dashboard')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: "Get the current teacher's dashboard statistics" })
  @ApiResponse({ status: 200, description: 'Teacher dashboard' })
  getMyDashboard(
    @CurrentUser('id') teacherId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.statisticsService.getTeacherStats(teacherId, teacherId, role);
  }
}
