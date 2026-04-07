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
exports.SubmitTestDto = exports.TestAnswerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TestAnswerDto {
}
exports.TestAnswerDto = TestAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-question' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestAnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'const' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestAnswerDto.prototype, "answer", void 0);
class SubmitTestDto {
}
exports.SubmitTestDto = SubmitTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TestAnswerDto],
        example: [
            { questionId: 'uuid-of-question-1', answer: 'const' },
            { questionId: 'uuid-of-question-2', answer: 'object' },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TestAnswerDto),
    __metadata("design:type", Array)
], SubmitTestDto.prototype, "answers", void 0);
//# sourceMappingURL=submit-test.dto.js.map