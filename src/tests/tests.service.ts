import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { PaginationQueryDto, paginate } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';

const TEST_SELECT = {
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  course: {
    select: {
      id: true,
      name: true,
      teacher: { select: { id: true, fullName: true } },
    },
  },
  _count: { select: { questions: true, results: true } },
};

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Test CRUD ────────────────────────────────────────────────────────────────

  async createTest(dto: CreateTestDto, teacherId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.teacherId !== teacherId)
      throw new ForbiddenException('You can only create tests for your own courses');

    return this.prisma.test.create({
      data: { title: dto.title, courseId: dto.courseId },
      select: TEST_SELECT,
    });
  }

  async findAllTests(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [tests, total] = await Promise.all([
      this.prisma.test.findMany({
        select: TEST_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.test.count(),
    ]);
    return paginate(tests, total, page, limit);
  }

  async findTestsByCourse(courseId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = { courseId };
    const [tests, total] = await Promise.all([
      this.prisma.test.findMany({
        where,
        select: TEST_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.test.count({ where }),
    ]);
    return paginate(tests, total, page, limit);
  }

  async findTestById(id: string, includeAnswers = false) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            teacher: { select: { id: true, fullName: true } },
          },
        },
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            // Only include correctAnswer when explicitly requested (for teachers)
            ...(includeAnswers ? { correctAnswer: true } : {}),
          },
        },
        _count: { select: { results: true } },
      },
    });

    if (!test) throw new NotFoundException(`Test with ID ${id} not found`);
    return test;
  }

  async updateTest(id: string, dto: UpdateTestDto, teacherId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!test) throw new NotFoundException('Test not found');
    if (test.course.teacherId !== teacherId)
      throw new ForbiddenException('You can only update tests for your own courses');

    return this.prisma.test.update({
      where: { id },
      data: dto,
      select: TEST_SELECT,
    });
  }

  async deleteTest(id: string, userId: string, role: Role) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!test) throw new NotFoundException('Test not found');
    if (role === Role.TEACHER && test.course.teacherId !== userId)
      throw new ForbiddenException('You can only delete tests for your own courses');

    await this.prisma.test.delete({ where: { id } });
    return { message: `Test ${id} deleted successfully` };
  }

  // ─── Questions ────────────────────────────────────────────────────────────────

  async addQuestion(testId: string, dto: AddQuestionDto, teacherId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { course: true },
    });
    if (!test) throw new NotFoundException('Test not found');
    if (test.course.teacherId !== teacherId)
      throw new ForbiddenException('You can only add questions to your own tests');

    if (!dto.options.includes(dto.correctAnswer)) {
      throw new BadRequestException('correctAnswer must be one of the provided options');
    }

    return this.prisma.question.create({
      data: {
        testId,
        text: dto.text,
        options: dto.options,
        correctAnswer: dto.correctAnswer,
      },
    });
  }

  async deleteQuestion(questionId: string, teacherId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { test: { include: { course: true } } },
    });
    if (!question) throw new NotFoundException('Question not found');
    if (question.test.course.teacherId !== teacherId)
      throw new ForbiddenException('You can only delete questions from your own tests');

    await this.prisma.question.delete({ where: { id: questionId } });
    return { message: 'Question deleted successfully' };
  }

  // ─── Auto-grading ─────────────────────────────────────────────────────────────

  async submitTest(testId: string, dto: SubmitTestDto, studentId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true, course: true },
    });
    if (!test) throw new NotFoundException('Test not found');

    // Verify enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId: test.courseId } },
    });
    if (!enrollment) throw new ForbiddenException('You are not enrolled in this course');

    // Check already submitted
    const existing = await this.prisma.result.findUnique({
      where: { studentId_testId: { studentId, testId } },
    });
    if (existing) throw new ConflictException('You have already submitted this test');

    if (test.questions.length === 0)
      throw new BadRequestException('This test has no questions yet');

    // Validate all questions are answered
    const questionIds = test.questions.map((q) => q.id);
    const answeredIds = dto.answers.map((a) => a.questionId);
    const missing = questionIds.filter((id) => !answeredIds.includes(id));
    if (missing.length > 0)
      throw new BadRequestException(
        `Missing answers for question(s): ${missing.join(', ')}`,
      );

    // Auto-grade
    let correctCount = 0;
    const gradedAnswers = dto.answers.map((answer) => {
      const question = test.questions.find((q) => q.id === answer.questionId);
      if (!question) throw new BadRequestException(`Invalid question ID: ${answer.questionId}`);

      const isCorrect = question.correctAnswer === answer.answer;
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
      };
    });

    const totalQuestions = test.questions.length;
    const wrongCount = totalQuestions - correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100 * 100) / 100;

    // Persist result and answers
    const result = await this.prisma.result.create({
      data: {
        studentId,
        testId,
        totalQuestions,
        correctCount,
        wrongCount,
        percentage,
        answers: {
          create: gradedAnswers,
        },
      },
      include: {
        answers: {
          include: { question: { select: { text: true, options: true, correctAnswer: true } } },
        },
        test: { select: { id: true, title: true } },
        student: { select: { id: true, fullName: true } },
      },
    });

    return {
      resultId: result.id,
      test: result.test,
      student: result.student,
      totalQuestions,
      correctCount,
      wrongCount,
      percentage,
      grade: this.calculateGrade(percentage),
      answers: result.answers,
    };
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
}
