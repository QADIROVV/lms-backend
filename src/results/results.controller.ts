import {
  Controller,
  Get,
  Param,
  Query,
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
import { ResultsService } from './results.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Results')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all results (Admin only)' })
  @ApiResponse({ status: 200, description: 'Paginated list of all results' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.resultsService.findAll(query);
  }

  @Get('my-results')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Get the current student's own results" })
  @ApiResponse({ status: 200, description: 'Paginated list of student results' })
  findMyResults(
    @CurrentUser('id') studentId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.resultsService.findMyResults(studentId, query);
  }

  @Get('test/:testId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all results for a test (Teacher/Admin)' })
  @ApiParam({ name: 'testId', type: String })
  @ApiResponse({ status: 200, description: 'Paginated results for this test' })
  findByTest(
    @Param('testId', ParseUUIDPipe) testId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
    @Query() query: PaginationQueryDto,
  ) {
    return this.resultsService.findByTest(testId, userId, userRole, query);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all results for a specific student' })
  @ApiParam({ name: 'studentId', type: String })
  @ApiResponse({ status: 200, description: 'Paginated results for this student' })
  findByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: Role,
    @Query() query: PaginationQueryDto,
  ) {
    return this.resultsService.findByStudent(studentId, requesterId, requesterRole, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single result by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Full result with graded answers' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.resultsService.findById(id, userId, userRole);
  }
}
