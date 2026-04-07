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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const client_1 = require("@prisma/client");
const COURSE_SELECT = {
    id: true,
    name: true,
    description: true,
    price: true,
    duration: true,
    createdAt: true,
    updatedAt: true,
    teacher: {
        select: { id: true, fullName: true, phone: true },
    },
    _count: {
        select: { enrollments: true, homeworks: true, tests: true },
    },
};
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const teacher = await this.prisma.user.findUnique({
            where: { id: dto.teacherId },
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        if (teacher.role !== client_1.Role.TEACHER)
            throw new common_1.BadRequestException('Assigned user must have TEACHER role');
        return this.prisma.course.create({
            data: dto,
            select: COURSE_SELECT,
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [courses, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                select: COURSE_SELECT,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.course.count({ where }),
        ]);
        return (0, pagination_query_dto_1.paginate)(courses, total, page, limit);
    }
    async findOne(id) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            select: COURSE_SELECT,
        });
        if (!course)
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        return course;
    }
    async findByTeacher(teacherId, query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = { teacherId };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [courses, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                select: COURSE_SELECT,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.course.count({ where }),
        ]);
        return (0, pagination_query_dto_1.paginate)(courses, total, page, limit);
    }
    async update(id, dto, userId, userRole) {
        const course = await this.findOne(id);
        if (userRole === client_1.Role.TEACHER && course.teacher.id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own courses');
        }
        if (dto.teacherId) {
            const teacher = await this.prisma.user.findUnique({ where: { id: dto.teacherId } });
            if (!teacher)
                throw new common_1.NotFoundException('Teacher not found');
            if (teacher.role !== client_1.Role.TEACHER)
                throw new common_1.BadRequestException('Assigned user must have TEACHER role');
        }
        return this.prisma.course.update({
            where: { id },
            data: dto,
            select: COURSE_SELECT,
        });
    }
    async assignTeacher(id, dto) {
        await this.findOne(id);
        const teacher = await this.prisma.user.findUnique({ where: { id: dto.teacherId } });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        if (teacher.role !== client_1.Role.TEACHER)
            throw new common_1.BadRequestException('Assigned user must have TEACHER role');
        return this.prisma.course.update({
            where: { id },
            data: { teacherId: dto.teacherId },
            select: COURSE_SELECT,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.course.delete({ where: { id } });
        return { message: `Course ${id} deleted successfully` };
    }
    async getCourseStudents(courseId, teacherId, query) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.teacherId !== teacherId)
            throw new common_1.ForbiddenException('You can only view students of your own courses');
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const [enrollments, total] = await Promise.all([
            this.prisma.enrollment.findMany({
                where: { courseId },
                include: {
                    student: {
                        select: { id: true, fullName: true, phone: true, age: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.enrollment.count({ where: { courseId } }),
        ]);
        return (0, pagination_query_dto_1.paginate)(enrollments, total, page, limit);
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map