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
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const client_1 = require("@prisma/client");
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
let ResultsService = class ResultsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
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
        return (0, pagination_query_dto_1.paginate)(results, total, page, limit);
    }
    async findById(id, userId, userRole) {
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
        if (!result)
            throw new common_1.NotFoundException(`Result with ID ${id} not found`);
        if (userRole === client_1.Role.STUDENT && result.studentId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own results');
        }
        if (userRole === client_1.Role.TEACHER) {
            const test = await this.prisma.test.findUnique({
                where: { id: result.testId },
                include: { course: true },
            });
            if (test?.course.teacherId !== userId) {
                throw new common_1.ForbiddenException('You can only view results for your own courses');
            }
        }
        return result;
    }
    async findMyResults(studentId, query) {
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
        return (0, pagination_query_dto_1.paginate)(results, total, page, limit);
    }
    async findByTest(testId, userId, userRole, query) {
        if (userRole === client_1.Role.TEACHER) {
            const test = await this.prisma.test.findUnique({
                where: { id: testId },
                include: { course: true },
            });
            if (!test)
                throw new common_1.NotFoundException('Test not found');
            if (test.course.teacherId !== userId)
                throw new common_1.ForbiddenException('You can only view results for your own tests');
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
        return (0, pagination_query_dto_1.paginate)(results, total, page, limit);
    }
    async findByStudent(studentId, requesterId, requesterRole, query) {
        if (requesterRole === client_1.Role.STUDENT && studentId !== requesterId)
            throw new common_1.ForbiddenException('You can only view your own results');
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
        return (0, pagination_query_dto_1.paginate)(results, total, page, limit);
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResultsService);
//# sourceMappingURL=results.service.js.map