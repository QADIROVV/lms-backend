import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, paginate } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';

const RESULT_SELECT = {
  id: true,
  totalQuestions: true,
  correctCount: true,
  wrongCount: true,
  percentage: true,
  createdAt: true,
  student: { select: { id: true, fullName: true, phone: true } },
  test: {
    select: {
      id: true,
      title: true,
      course: { select: { id: true, name: true } },
    },
  },
};

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.prisma.result.findMany({
        select: RESULT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.result.count(),
    ]);
    return paginate(results, total, page, limit);
  }

  async findById(id: string, userId: string, userRole: Role) {
    const result = await this.prisma.result.findUnique({
      where: { id },
      include: {
        ...RESULT_SELECT,
        answers: {
          include: {
            question: { select: { text: true, options: true, correctAnswer: true } },
          },
        },
      },
    });

    if (!result) throw new NotFoundException(`Result with ID ${id} not found`);

    // Students can only view their own results
    if (userRole === Role.STUDENT && result.studentId !== userId) {
      throw new ForbiddenException('You can only view your own results');
    }

    // Teachers can only view results for their courses
    if (userRole === Role.TEACHER) {
      const test = await this.prisma.test.findUnique({
        where: { id: result.testId },
        include: { course: true },
      });
      if (test?.course.teacherId !== userId) {
        throw new ForbiddenException('You can only view results for your own courses');
      }
    }

    return result;
  }

  async findMyResults(studentId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { studentId };
    const [results, total] = await Promise.all([
      this.prisma.result.findMany({
        where,
        select: RESULT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.result.count({ where }),
    ]);
    return paginate(results, total, page, limit);
  }

  async findByTest(testId: string, userId: string, userRole: Role, query: PaginationQueryDto) {
    // Teachers can only view results for their own tests
    if (userRole === Role.TEACHER) {
      const test = await this.prisma.test.findUnique({
        where: { id: testId },
        include: { course: true },
      });
      if (!test) throw new NotFoundException('Test not found');
      if (test.course.teacherId !== userId)
        throw new ForbiddenException('You can only view results for your own tests');
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { testId };

    const [results, total] = await Promise.all([
      this.prisma.result.findMany({
        where,
        select: RESULT_SELECT,
        skip,
        take: limit,
        orderBy: { percentage: 'desc' },
      }),
      this.prisma.result.count({ where }),
    ]);

    return paginate(results, total, page, limit);
  }

  async findByStudent(studentId: string, requesterId: string, requesterRole: Role, query: PaginationQueryDto) {
    if (requesterRole === Role.STUDENT && studentId !== requesterId)
      throw new ForbiddenException('You can only view your own results');

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { studentId };

    const [results, total] = await Promise.all([
      this.prisma.result.findMany({
        where,
        select: RESULT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.result.count({ where }),
    ]);

    return paginate(results, total, page, limit);
  }
}
