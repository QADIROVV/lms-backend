"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const client_1 = require("@prisma/client");
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
let TestsService = class TestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTest(dto, teacherId) {
        const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only create tests for your own courses');
        return this.prisma.test.create({
            data: { title: dto.title, courseId: dto.courseId },
            select: TEST_SELECT,
        });
    }
    async findAllTests(query) {
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
        return (0, pagination_query_dto_1.paginate)(tests, total, page, limit);
    }
    async findTestsByCourse(courseId, query) {
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
        return (0, pagination_query_dto_1.paginate)(tests, total, page, limit);
    }
    async findTestById(id, includeAnswers = false) {
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
                        ...(includeAnswers ? { correctAnswer: true } : {}),
                    },
                },
                _count: { select: { results: true } },
            },
        });
        if (!test)
            throw new common_1.NotFoundException(`Test with ID ${id} not found`);
        return test;
    }
    async updateTest(id, dto, teacherId) {
        const test = await this.prisma.test.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        if (test.course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only update tests for your own courses');
        return this.prisma.test.update({
            where: { id },
            data: dto,
            select: TEST_SELECT,
        });
    }
    async deleteTest(id, userId, role) {
        const test = await this.prisma.test.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        if (role === client_1.Role.TEACHER && test.course.teacherId !== userId)
            throw new common_1.ForbiddenException('You can only delete tests for your own courses');
        await this.prisma.test.delete({ where: { id } });
        return { message: `Test ${id} deleted successfully` };
    }
    async addQuestion(testId, dto, teacherId) {
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
            include: { course: true },
        });
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        if (test.course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only add questions to your own tests');
        if (!dto.options.includes(dto.correctAnswer)) {
            throw new common_1.BadRequestException('correctAnswer must be one of the provided options');
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
    async deleteQuestion(questionId, teacherId) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { test: { include: { course: true } } },
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.test.course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only delete questions from your own tests');
        await this.prisma.question.delete({ where: { id: questionId } });
        return { message: 'Question deleted successfully' };
    }
    async submitTest(testId, dto, studentId) {
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
            include: { questions: true, course: true },
        });
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId, courseId: test.courseId } },
        });
        if (!enrollment)
            throw new common_1.ForbiddenException('You are not enrolled in this course');
        const existing = await this.prisma.result.findUnique({
            where: { studentId_testId: { studentId, testId } },
        });
        if (existing)
            throw new common_1.ConflictException('You have already submitted this test');
        if (test.questions.length === 0)
            throw new common_1.BadRequestException('This test has no questions yet');
        const questionIds = test.questions.map((q) => q.id);
        const answeredIds = dto.answers.map((a) => a.questionId);
        const missing = questionIds.filter((id) => !answeredIds.includes(id));
        if (missing.length > 0)
            throw new common_1.BadRequestException(`Missing answers for question(s): ${missing.join(', ')}`);
        let correctCount = 0;
        const gradedAnswers = dto.answers.map((answer) => {
            const question = test.questions.find((q) => q.id === answer.questionId);
            if (!question)
                throw new common_1.BadRequestException(`Invalid question ID: ${answer.questionId}`);
            const isCorrect = question.correctAnswer === answer.answer;
            if (isCorrect)
                correctCount++;
            return {
                questionId: answer.questionId,
                answer: answer.answer,
                isCorrect,
            };
        });
        const totalQuestions = test.questions.length;
        const wrongCount = totalQuestions - correctCount;
        const percentage = Math.round((correctCount / totalQuestions) * 100 * 100) / 100;
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
    calculateGrade(percentage) {
        if (percentage >= 90)
            return 'A';
        if (percentage >= 80)
            return 'B';
        if (percentage >= 70)
            return 'C';
        if (percentage >= 60)
            return 'D';
        return 'F';
    }
};
exports.TestsService = TestsService;
exports.TestsService = TestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestsService);
//# sourceMappingURL=tests.service.js.map