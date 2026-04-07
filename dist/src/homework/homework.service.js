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
exports.HomeworkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const client_1 = require("@prisma/client");
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
let HomeworkService = class HomeworkService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createHomework(dto, teacherId) {
        const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only create homework for your own courses');
        return this.prisma.homework.create({
            data: dto,
            select: HOMEWORK_SELECT,
        });
    }
    async findAllHomework(query) {
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
        return (0, pagination_query_dto_1.paginate)(homeworks, total, page, limit);
    }
    async findHomeworkByCourse(courseId, query) {
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
        return (0, pagination_query_dto_1.paginate)(homeworks, total, page, limit);
    }
    async findHomeworkById(id) {
        const homework = await this.prisma.homework.findUnique({
            where: { id },
            select: HOMEWORK_SELECT,
        });
        if (!homework)
            throw new common_1.NotFoundException(`Homework with ID ${id} not found`);
        return homework;
    }
    async updateHomework(id, dto, teacherId) {
        const homework = await this.prisma.homework.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!homework)
            throw new common_1.NotFoundException('Homework not found');
        if (homework.course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only update homework for your own courses');
        return this.prisma.homework.update({
            where: { id },
            data: dto,
            select: HOMEWORK_SELECT,
        });
    }
    async deleteHomework(id, teacherId, role) {
        const homework = await this.prisma.homework.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!homework)
            throw new common_1.NotFoundException('Homework not found');
        if (role === client_1.Role.TEACHER && homework.course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only delete homework for your own courses');
        await this.prisma.homework.delete({ where: { id } });
        return { message: `Homework ${id} deleted successfully` };
    }
    async submitHomework(homeworkId, dto, studentId) {
        const homework = await this.prisma.homework.findUnique({
            where: { id: homeworkId },
            include: { course: true },
        });
        if (!homework)
            throw new common_1.NotFoundException('Homework not found');
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId, courseId: homework.courseId } },
        });
        if (!enrollment)
            throw new common_1.ForbiddenException('You are not enrolled in this course');
        if (new Date() > homework.deadline) {
            throw new common_1.ForbiddenException('Submission deadline has passed');
        }
        const existing = await this.prisma.submission.findUnique({
            where: { studentId_homeworkId: { studentId, homeworkId } },
        });
        if (existing)
            throw new common_1.ConflictException('You have already submitted this homework');
        return this.prisma.submission.create({
            data: { studentId, homeworkId, ...dto },
            select: SUBMISSION_SELECT,
        });
    }
    async findSubmissionsByHomework(homeworkId, teacherId, query) {
        const homework = await this.prisma.homework.findUnique({
            where: { id: homeworkId },
            include: { course: true },
        });
        if (!homework)
            throw new common_1.NotFoundException('Homework not found');
        if (homework.course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only view submissions for your own courses');
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
        return (0, pagination_query_dto_1.paginate)(submissions, total, page, limit);
    }
    async findMySubmissions(studentId, query) {
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
        return (0, pagination_query_dto_1.paginate)(submissions, total, page, limit);
    }
};
exports.HomeworkService = HomeworkService;
exports.HomeworkService = HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeworkService);
//# sourceMappingURL=homework.service.js.map