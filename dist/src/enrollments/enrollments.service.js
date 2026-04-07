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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const client_1 = require("@prisma/client");
const ENROLLMENT_SELECT = {
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    student: {
        select: { id: true, fullName: true, phone: true, age: true },
    },
    course: {
        select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            teacher: { select: { id: true, fullName: true } },
        },
    },
};
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enroll(dto, studentId) {
        const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const existing = await this.prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId, courseId: dto.courseId } },
        });
        if (existing) {
            if (existing.status === client_1.EnrollmentStatus.ACTIVE) {
                throw new common_1.ConflictException('You are already enrolled in this course');
            }
            return this.prisma.enrollment.update({
                where: { id: existing.id },
                data: { status: client_1.EnrollmentStatus.ACTIVE },
                select: ENROLLMENT_SELECT,
            });
        }
        return this.prisma.enrollment.create({
            data: { studentId, courseId: dto.courseId },
            select: ENROLLMENT_SELECT,
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const [enrollments, total] = await Promise.all([
            this.prisma.enrollment.findMany({
                select: ENROLLMENT_SELECT,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.enrollment.count(),
        ]);
        return (0, pagination_query_dto_1.paginate)(enrollments, total, page, limit);
    }
    async findMyEnrollments(studentId, query) {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = { studentId };
        const [enrollments, total] = await Promise.all([
            this.prisma.enrollment.findMany({
                where,
                select: ENROLLMENT_SELECT,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.enrollment.count({ where }),
        ]);
        return (0, pagination_query_dto_1.paginate)(enrollments, total, page, limit);
    }
    async findOne(id) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id },
            select: ENROLLMENT_SELECT,
        });
        if (!enrollment)
            throw new common_1.NotFoundException(`Enrollment with ID ${id} not found`);
        return enrollment;
    }
    async updateStatus(id, dto, userId, userRole) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!enrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        if (userRole === client_1.Role.STUDENT) {
            if (enrollment.studentId !== userId) {
                throw new common_1.ForbiddenException('You can only manage your own enrollments');
            }
            if (dto.status !== client_1.EnrollmentStatus.DROPPED) {
                throw new common_1.ForbiddenException('Students can only drop from a course');
            }
        }
        if (userRole === client_1.Role.TEACHER) {
            if (enrollment.course.teacherId !== userId) {
                throw new common_1.ForbiddenException('You can only manage enrollments of your own courses');
            }
        }
        return this.prisma.enrollment.update({
            where: { id },
            data: { status: dto.status },
            select: ENROLLMENT_SELECT,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.enrollment.delete({ where: { id } });
        return { message: `Enrollment ${id} deleted successfully` };
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map