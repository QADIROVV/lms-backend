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
exports.EnrollmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const enrollments_service_1 = require("./enrollments.service");
const create_enrollment_dto_1 = require("./dto/create-enrollment.dto");
const update_enrollment_dto_1 = require("./dto/update-enrollment.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let EnrollmentsController = class EnrollmentsController {
    constructor(enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }
    enroll(dto, studentId) {
        return this.enrollmentsService.enroll(dto, studentId);
    }
    findAll(query) {
        return this.enrollmentsService.findAll(query);
    }
    findMyEnrollments(studentId, query) {
        return this.enrollmentsService.findMyEnrollments(studentId, query);
    }
    findOne(id) {
        return this.enrollmentsService.findOne(id);
    }
    updateStatus(id, dto, userId, userRole) {
        return this.enrollmentsService.updateStatus(id, dto, userId, userRole);
    }
    remove(id) {
        return this.enrollmentsService.remove(id);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll in a course (Student only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Enrolled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already enrolled' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enrollment_dto_1.CreateEnrollmentDto, String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "enroll", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all enrollments (Admin only)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-enrollments'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: "Get student's own enrollments" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "findMyEnrollments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get enrollment by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update enrollment status (drop/reactivate)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_enrollment_dto_1.UpdateEnrollmentDto, String, String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete enrollment (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "remove", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, swagger_1.ApiTags)('Enrollments'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('enrollments'),
    __metadata("design:paramtypes", [enrollments_service_1.EnrollmentsService])
], EnrollmentsController);
//# sourceMappingURL=enrollments.controller.js.map