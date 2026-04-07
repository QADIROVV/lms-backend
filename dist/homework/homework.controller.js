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
exports.HomeworkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const homework_service_1 = require("./homework.service");
const create_homework_dto_1 = require("./dto/create-homework.dto");
const update_homework_dto_1 = require("./dto/update-homework.dto");
const submit_homework_dto_1 = require("./dto/submit-homework.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let HomeworkController = class HomeworkController {
    constructor(homeworkService) {
        this.homeworkService = homeworkService;
    }
    createHomework(dto, teacherId) {
        return this.homeworkService.createHomework(dto, teacherId);
    }
    findAllHomework(query) {
        return this.homeworkService.findAllHomework(query);
    }
    findHomeworkByCourse(courseId, query) {
        return this.homeworkService.findHomeworkByCourse(courseId, query);
    }
    findHomeworkById(id) {
        return this.homeworkService.findHomeworkById(id);
    }
    updateHomework(id, dto, teacherId) {
        return this.homeworkService.updateHomework(id, dto, teacherId);
    }
    deleteHomework(id, userId, role) {
        return this.homeworkService.deleteHomework(id, userId, role);
    }
    submitHomework(homeworkId, dto, studentId) {
        return this.homeworkService.submitHomework(homeworkId, dto, studentId);
    }
    findSubmissionsByHomework(homeworkId, teacherId, query) {
        return this.homeworkService.findSubmissionsByHomework(homeworkId, teacherId, query);
    }
    findMySubmissions(studentId, query) {
        return this.homeworkService.findMySubmissions(studentId, query);
    }
};
exports.HomeworkController = HomeworkController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Create homework for a course (Teacher only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Homework created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_homework_dto_1.CreateHomeworkDto, String]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "createHomework", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all homework (Admin only)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "findAllHomework", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get homework by course ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "findHomeworkByCourse", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get homework by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "findHomeworkById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Update homework (Teacher only — own course)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_homework_dto_1.UpdateHomeworkDto, String]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "updateHomework", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER, client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete homework (Teacher own course / Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "deleteHomework", null);
__decorate([
    (0, common_1.Post)(':homeworkId/submit'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Submit homework (Student only)' }),
    (0, swagger_1.ApiParam)({ name: 'homeworkId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Homework submitted' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already submitted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not enrolled / deadline passed' }),
    __param(0, (0, common_1.Param)('homeworkId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_homework_dto_1.SubmitHomeworkDto, String]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "submitHomework", null);
__decorate([
    (0, common_1.Get)(':homeworkId/submissions'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get submissions for a homework (Teacher own course / Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'homeworkId', type: String }),
    __param(0, (0, common_1.Param)('homeworkId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "findSubmissionsByHomework", null);
__decorate([
    (0, common_1.Get)('submissions/my'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: "Get student's own submissions" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "findMySubmissions", null);
exports.HomeworkController = HomeworkController = __decorate([
    (0, swagger_1.ApiTags)('Homework'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('homework'),
    __metadata("design:paramtypes", [homework_service_1.HomeworkService])
], HomeworkController);
//# sourceMappingURL=homework.controller.js.map