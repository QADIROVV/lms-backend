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
exports.TestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const tests_service_1 = require("./tests.service");
const create_test_dto_1 = require("./dto/create-test.dto");
const update_test_dto_1 = require("./dto/update-test.dto");
const add_question_dto_1 = require("./dto/add-question.dto");
const submit_test_dto_1 = require("./dto/submit-test.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let TestsController = class TestsController {
    constructor(testsService) {
        this.testsService = testsService;
    }
    createTest(dto, teacherId) {
        return this.testsService.createTest(dto, teacherId);
    }
    findAllTests(query) {
        return this.testsService.findAllTests(query);
    }
    findTestsByCourse(courseId, query) {
        return this.testsService.findTestsByCourse(courseId, query);
    }
    findTestById(id, role) {
        const includeAnswers = role === client_1.Role.TEACHER || role === client_1.Role.ADMIN;
        return this.testsService.findTestById(id, includeAnswers);
    }
    updateTest(id, dto, teacherId) {
        return this.testsService.updateTest(id, dto, teacherId);
    }
    deleteTest(id, userId, role) {
        return this.testsService.deleteTest(id, userId, role);
    }
    addQuestion(testId, dto, teacherId) {
        return this.testsService.addQuestion(testId, dto, teacherId);
    }
    deleteQuestion(questionId, teacherId) {
        return this.testsService.deleteQuestion(questionId, teacherId);
    }
    submitTest(testId, dto, studentId) {
        return this.testsService.submitTest(testId, dto, studentId);
    }
};
exports.TestsController = TestsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a test for a course (Teacher only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_test_dto_1.CreateTestDto, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "createTest", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tests (Admin only)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "findAllTests", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tests by course ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "findTestsByCourse", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get test by ID (students see questions without correct answers)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "findTestById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Update test (Teacher only — own course)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_test_dto_1.UpdateTestDto, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "updateTest", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER, client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete test (Teacher own course / Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "deleteTest", null);
__decorate([
    (0, common_1.Post)(':testId/questions'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Add a question to a test (Teacher only)' }),
    (0, swagger_1.ApiParam)({ name: 'testId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Question added' }),
    __param(0, (0, common_1.Param)('testId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_question_dto_1.AddQuestionDto, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:questionId'),
    (0, roles_decorator_1.Roles)(client_1.Role.TEACHER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a question (Teacher only — own test)' }),
    (0, swagger_1.ApiParam)({ name: 'questionId', type: String }),
    __param(0, (0, common_1.Param)('questionId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)(':testId/submit'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit test answers — auto-graded (Student only)' }),
    (0, swagger_1.ApiParam)({ name: 'testId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test graded with score breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already submitted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not enrolled in course' }),
    __param(0, (0, common_1.Param)('testId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_test_dto_1.SubmitTestDto, String]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "submitTest", null);
exports.TestsController = TestsController = __decorate([
    (0, swagger_1.ApiTags)('Tests'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('tests'),
    __metadata("design:paramtypes", [tests_service_1.TestsService])
], TestsController);
//# sourceMappingURL=tests.controller.js.map