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
exports.ResultsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const results_service_1 = require("./results.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ResultsController = class ResultsController {
    constructor(resultsService) {
        this.resultsService = resultsService;
    }
    findAll(query) {
        return this.resultsService.findAll(query);
    }
    findMyResults(studentId, query) {
        return this.resultsService.findMyResults(studentId, query);
    }
    findByTest(testId, userId, userRole, query) {
        return this.resultsService.findByTest(testId, userId, userRole, query);
    }
    findByStudent(studentId, requesterId, requesterRole, query) {
        return this.resultsService.findByStudent(studentId, requesterId, requesterRole, query);
    }
    findById(id, userId, userRole) {
        return this.resultsService.findById(id, userId, userRole);
    }
};
exports.ResultsController = ResultsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all results (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of all results' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-results'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: "Get the current student's own results" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of student results' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findMyResults", null);
__decorate([
    (0, common_1.Get)('test/:testId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all results for a test (Teacher/Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'testId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated results for this test' }),
    __param(0, (0, common_1.Param)('testId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findByTest", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get all results for a specific student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated results for this student' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single result by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Full result with graded answers' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Result not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "findById", null);
exports.ResultsController = ResultsController = __decorate([
    (0, swagger_1.ApiTags)('Results'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('results'),
    __metadata("design:paramtypes", [results_service_1.ResultsService])
], ResultsController);
//# sourceMappingURL=results.controller.js.map