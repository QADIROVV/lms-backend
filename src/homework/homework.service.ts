import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { PaginationQueryDto, paginate } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';

const HOMEWORK_SELECT = {
  id: true,
  title: true,
  description: true,
  deadline: true,
  createdAt: true,
  updatedAt: true,
  course: {
    select: {
      id: true,
      name: true,
      teacher: { select: { id: true, fullName: true } },
    },
  },
  _count: { select: { submissions: true } },
};

const SUBMISSION_SELECT = {
  id: true,
  content: true,
  fileUrl: true,
  createdAt: true,
  updatedAt: true,
  student: { select: { id: true, fullName: true, phone: true } },
  homework: { select: { id: true, title: true, deadline: true } },
};

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Homework CRUD ────────────────────────────────────────────────────────────

  async createHomework(dto: CreateHomeworkDto, teacherId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.teacherId !== teacherId)
      throw new ForbiddenException('You can only create homework for your own courses');

    return this.prisma.homework.create({
      data: dto,
      select: HOMEWORK_SELECT,
    });
  }

  async findAllHomework(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [homeworks, total] = await Promise.all([
      this.prisma.homework.findMany({
        select: HOMEWORK_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.homework.count(),
    ]);
    return paginate(homeworks, total, page, limit);
  }

  async findHomeworkByCourse(courseId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { courseId };
    const [homeworks, total] = await Promise.all([
      this.prisma.homework.findMany({
        where,
        select: HOMEWORK_SELECT,
        skip,
        take: limit,
        orderBy: { deadline: 'asc' },
      }),
      this.prisma.homework.count({ where }),
    ]);
    return paginate(homeworks, total, page, limit);
  }

  async findHomeworkById(id: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      select: HOMEWORK_SELECT,
    });
    if (!homework) throw new NotFoundException(`Homework with ID ${id} not found`);
    return homework;
  }

  async updateHomework(id: string, dto: UpdateHomeworkDto, teacherId: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!homework) throw new NotFoundException('Homework not found');
    if (homework.course.teacherId !== teacherId)
      throw new ForbiddenException('You can only update homework for your own courses');

    return this.prisma.homework.update({
      where: { id },
      data: dto,
      select: HOMEWORK_SELECT,
    });
  }

  async deleteHomework(id: string, teacherId: string, role: Role) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!homework) throw new NotFoundException('Homework not found');
    if (role === Role.TEACHER && homework.course.teacherId !== teacherId)
      throw new ForbiddenException('You can only delete homework for your own courses');

    await this.prisma.homework.delete({ where: { id } });
    return { message: `Homework ${id} deleted successfully` };
  }

  // ─── Submissions ─────────────────────────────────────────────────────────────

  async submitHomework(homeworkId: string, dto: SubmitHomeworkDto, studentId: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
      include: { course: true },
    });
    if (!homework) throw new NotFoundException('Homework not found');

    // Ensure student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId: homework.courseId } },
    });
    if (!enrollment) throw new ForbiddenException('You are not enrolled in this course');

    // Check deadline
    if (new Date() > homework.deadline) {
      throw new ForbiddenException('Submission deadline has passed');
    }

    // Check duplicate submission
    const existing = await this.prisma.submission.findUnique({
      where: { studentId_homeworkId: { studentId, homeworkId } },
    });
    if (existing) throw new ConflictException('You have already submitted this homework');

    return this.prisma.submission.create({
      data: { studentId, homeworkId, ...dto },
      select: SUBMISSION_SELECT,
    });
  }

  async findSubmissionsByHomework(homeworkId: string, teacherId: string, query: PaginationQueryDto) {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
      include: { course: true },
    });
    if (!homework) throw new NotFoundException('Homework not found');
    if (homework.course.teacherId !== teacherId)
      throw new ForbiddenException('You can only view submissions for your own courses');

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { homeworkId };

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        select: SUBMISSION_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.submission.count({ where }),
    ]);

    return paginate(submissions, total, page, limit);
  }

  async findMySubmissions(studentId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { studentId };

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        select: SUBMISSION_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.submission.count({ where }),
    ]);

    return paginate(submissions, total, page, limit);
  }
}
