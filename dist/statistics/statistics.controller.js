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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const statistics_service_1 = require("./statistics.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let StatisticsController = class StatisticsController {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    getPlatformStats() {
        return this.statisticsService.getPlatformStats();
    }
    getTeacherStats(teacherId, requesterId, requesterRole) {
        return this.statisticsService.getTeacherStats(teacherId, requesterId, requesterRole);
    }
    getStudentStats(studentId, requesterId, requesterRole) {
        return this.statisticsService.getStudentStats(studentId, requesterId, requesterRole);
    }
    getCourseStats(courseId, userId, userRole) {
        return this.statisticsService.getCourseStats(courseId, userId, userRole);
    }
    getCourseLeaderboard(courseId, userId, userRole) {
        return this.statisticsService.getCourseLeaderboard(courseId, userId, userRole);
    }
    getMyStats(studentId, role) {
        return this.statisticsService.getStudentStats(studentId, studentId, role);
    }
    getMyDashboard(teacherId, role) {
        return this.statisticsService.getTeacherStats(teacherId, teacherId, role);
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('platform'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform-wide statistics (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Total users, courses, enrollments, test performance',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getPlatformStats", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Get teacher dashboard statistics (Teacher/Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'teacherId', type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Courses taught, enrollments, student performance',
    }),
    __param(0, (0, common_1.Param)('teacherId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getTeacherStats", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get student personal statistics — enrollments, submissions, test scores',
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student stats with recent results' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getStudentStats", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed statistics for a course (Teacher/Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active/dropped students, average score, content counts',
    }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getCourseStats", null);
__decorate([
    (0, common_1.Get)('course/:courseId/leaderboard'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get test score leaderboard for a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ranked list of students by best test score',
    }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getCourseLeaderboard", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: "Get the current student's own statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current student personal stats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('my-dashboard'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: "Get the current teacher's dashboard statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Teacher dashboard' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getMyDashboard", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, swagger_1.ApiTags)('Statistics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map