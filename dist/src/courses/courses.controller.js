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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const assign_teacher_dto_1 = require("./dto/assign-teacher.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    create(dto) {
        return this.coursesService.create(dto);
    }
    findAll(query) {
        return this.coursesService.findAll(query);
    }
    findMyCourses(teacherId, query) {
        return this.coursesService.findByTeacher(teacherId, query);
    }
    findOne(id) {
        return this.coursesService.findOne(id);
    }
    getCourseStudents(id, teacherId, role, query) {
        const effectiveTeacherId = role === client_1.Role.ADMIN ? id : teacherId;
        return this.coursesService.getCourseStudents(id, effectiveTeacherId, query);
    }
    update(id, dto, userId, userRole) {
        return this.coursesService.update(id, dto, userId, userRole);
    }
    assignTeacher(id, dto) {
        return this.coursesService.assignTeacher(id, dto);
    }
    remove(id) {
        return this.coursesService.remove(id);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new course (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Course created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of courses' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-courses'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: "Get teacher's own courses" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findMyCourses", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get course by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/students'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get students enrolled in a course (Teacher/Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getCourseStudents", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a course (Admin or assigned Teacher)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto, String, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/assign-teacher'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a teacher to a course (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_teacher_dto_1.AssignTeacherDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "assignTeacher", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a course (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "remove", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map