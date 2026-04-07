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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StatisticsService = class StatisticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCourseStats(courseId, userId, userRole) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { teacher: { select: { id: true, fullName: true } } },
        });
        if (!course)
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found`);
        if (userRole === client_1.Role.TEACHER && course.teacherId !== userId) {
            throw new common_1.ForbiddenException('You can only view statistics for your own courses');
        }
        const [totalStudents, activeStudents, droppedStudents, results, homeworkCount, testCount] = await Promise.all([
            this.prisma.enrollment.count({ where: { courseId } }),
            this.prisma.enrollment.count({ where: { courseId, status: client_1.EnrollmentStatus.ACTIVE } }),
            this.prisma.enrollment.count({ where: { courseId, status: client_1.EnrollmentStatus.DROPPED } }),
            this.prisma.result.findMany({
                where: { test: { courseId } },
                select: { percentage: true },
            }),
            this.prisma.homework.count({ where: { courseId } }),
            this.prisma.test.count({ where: { courseId } }),
        ]);
        const averageScore = results.length > 0
            ? Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / results.length) * 100) / 100
            : 0;
        return {
            course: {
                id: course.id,
                name: course.name,
                teacher: course.teacher,
            },
            enrollments: {
                total: totalStudents,
                active: activeStudents,
                dropped: droppedStudents,
                dropRate: totalStudents > 0
                    ? Math.round((droppedStudents / totalStudents) * 10000) / 100
                    : 0,
            },
            content: {
                homeworks: homeworkCount,
                tests: testCount,
            },
            performance: {
                totalTestSubmissions: results.length,
                averageScore,
                grade: this.calculateGrade(averageScore),
            },
        };
    }
    async getTeacherStats(teacherId, requesterId, requesterRole) {
        if (requesterRole === client_1.Role.TEACHER && teacherId !== requesterId) {
            throw new common_1.ForbiddenException('You can only view your own statistics');
        }
        const teacher = await this.prisma.user.findUnique({
            where: { id: teacherId },
            select: { id: true, fullName: true, role: true },
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        if (teacher.role !== client_1.Role.TEACHER)
            throw new common_1.ForbiddenException('User is not a teacher');
        const courses = await this.prisma.course.findMany({
            where: { teacherId },
            select: {
                id: true,
                name: true,
                _count: {
                    select: { enrollments: true, homeworks: true, tests: true },
                },
            },
        });
        const courseIds = courses.map((c) => c.id);
        const [totalActive, totalDropped, allResults] = await Promise.all([
            this.prisma.enrollment.count({
                where: { courseId: { in: courseIds }, status: client_1.EnrollmentStatus.ACTIVE },
            }),
            this.prisma.enrollment.count({
                where: { courseId: { in: courseIds }, status: client_1.EnrollmentStatus.DROPPED },
            }),
            this.prisma.result.findMany({
                where: { test: { courseId: { in: courseIds } } },
                select: { percentage: true },
            }),
        ]);
        const totalEnrollments = totalActive + totalDropped;
        const averageScore = allResults.length > 0
            ? Math.round((allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length) * 100) / 100
            : 0;
        return {
            teacher: { id: teacher.id, fullName: teacher.fullName },
            summary: {
                totalCourses: courses.length,
                totalEnrollments,
                activeStudents: totalActive,
                droppedStudents: totalDropped,
                totalTestSubmissions: allResults.length,
                averageScore,
            },
            courses: courses.map((c) => ({
                id: c.id,
                name: c.name,
                enrollments: c._count.enrollments,
                homeworks: c._count.homeworks,
                tests: c._count.tests,
            })),
        };
    }
    async getPlatformStats() {
        const [totalUsers, totalStudents, totalTeachers, totalAdmins, totalCourses, totalEnrollments, activeEnrollments, droppedEnrollments, totalHomeworks, totalSubmissions, totalTests, totalResults, allResults,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: client_1.Role.STUDENT } }),
            this.prisma.user.count({ where: { role: client_1.Role.TEACHER } }),
            this.prisma.user.count({ where: { role: client_1.Role.ADMIN } }),
            this.prisma.course.count(),
            this.prisma.enrollment.count(),
            this.prisma.enrollment.count({ where: { status: client_1.EnrollmentStatus.ACTIVE } }),
            this.prisma.enrollment.count({ where: { status: client_1.EnrollmentStatus.DROPPED } }),
            this.prisma.homework.count(),
            this.prisma.submission.count(),
            this.prisma.test.count(),
            this.prisma.result.count(),
            this.prisma.result.findMany({ select: { percentage: true } }),
        ]);
        const averageScore = allResults.length > 0
            ? Math.round((allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length) * 100) / 100
            : 0;
        return {
            users: {
                total: totalUsers,
                students: totalStudents,
                teachers: totalTeachers,
                admins: totalAdmins,
            },
            courses: {
                total: totalCourses,
            },
            enrollments: {
                total: totalEnrollments,
                active: activeEnrollments,
                dropped: droppedEnrollments,
                dropRate: totalEnrollments > 0
                    ? Math.round((droppedEnrollments / totalEnrollments) * 10000) / 100
                    : 0,
            },
            homework: {
                total: totalHomeworks,
                totalSubmissions,
                submissionRate: totalHomeworks > 0
                    ? Math.round((totalSubmissions / totalHomeworks) * 100)
                    : 0,
            },
            tests: {
                total: totalTests,
                totalSubmissions: totalResults,
                averageScore,
            },
        };
    }
    async getStudentStats(studentId, requesterId, requesterRole) {
        if (requesterRole === client_1.Role.STUDENT && studentId !== requesterId) {
            throw new common_1.ForbiddenException('You can only view your own statistics');
        }
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
            select: { id: true, fullName: true, role: true },
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        if (student.role !== client_1.Role.STUDENT)
            throw new common_1.ForbiddenException('User is not a student');
        const [enrollments, submissions, results] = await Promise.all([
            this.prisma.enrollment.findMany({
                where: { studentId },
                select: {
                    status: true,
                    course: { select: { id: true, name: true } },
                },
            }),
            this.prisma.submission.count({ where: { studentId } }),
            this.prisma.result.findMany({
                where: { studentId },
                select: {
                    percentage: true,
                    correctCount: true,
                    wrongCount: true,
                    totalQuestions: true,
                    test: { select: { title: true, course: { select: { name: true } } } },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        const activeEnrollments = enrollments.filter((e) => e.status === client_1.EnrollmentStatus.ACTIVE);
        const droppedEnrollments = enrollments.filter((e) => e.status === client_1.EnrollmentStatus.DROPPED);
        const averageScore = results.length > 0
            ? Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / results.length) * 100) / 100
            : 0;
        const bestResult = results.reduce((best, r) => (!best || r.percentage > best.percentage ? r : best), null);
        return {
            student: { id: student.id, fullName: student.fullName },
            enrollments: {
                total: enrollments.length,
                active: activeEnrollments.length,
                dropped: droppedEnrollments.length,
                activeCourses: activeEnrollments.map((e) => e.course),
            },
            homework: {
                totalSubmissions: submissions,
            },
            tests: {
                totalAttempted: results.length,
                averageScore,
                bestResult: bestResult
                    ? {
                        test: bestResult.test.title,
                        course: bestResult.test.course.name,
                        score: bestResult.percentage,
                        correct: bestResult.correctCount,
                        wrong: bestResult.wrongCount,
                    }
                    : null,
                recentResults: results.slice(0, 5),
            },
        };
    }
    async getCourseLeaderboard(courseId, userId, userRole) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (userRole === client_1.Role.TEACHER && course.teacherId !== userId) {
            throw new common_1.ForbiddenException('You can only view leaderboard for your own courses');
        }
        const results = await this.prisma.result.findMany({
            where: { test: { courseId } },
            include: {
                student: { select: { id: true, fullName: true } },
                test: { select: { title: true } },
            },
            orderBy: { percentage: 'desc' },
        });
        const studentMap = new Map();
        for (const result of results) {
            const existing = studentMap.get(result.studentId);
            if (!existing) {
                studentMap.set(result.studentId, {
                    student: result.student,
                    bestScore: result.percentage,
                    attempts: 1,
                });
            }
            else {
                existing.attempts++;
                if (result.percentage > existing.bestScore) {
                    existing.bestScore = result.percentage;
                }
            }
        }
        const leaderboard = Array.from(studentMap.values())
            .sort((a, b) => b.bestScore - a.bestScore)
            .map((entry, index) => ({
            rank: index + 1,
            student: entry.student,
            bestScore: entry.bestScore,
            grade: this.calculateGrade(entry.bestScore),
            testAttempts: entry.attempts,
        }));
        return {
            course: { id: course.id, name: course.name },
            leaderboard,
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
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map