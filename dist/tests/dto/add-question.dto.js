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
exports.AddQuestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddQuestionDto {
}
exports.AddQuestionDto = AddQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Which keyword is used to declare a constant in JavaScript?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddQuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['var', 'let', 'const', 'def'],
        description: 'Array of 2–6 answer options',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ArrayMaxSize)(6),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AddQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'const',
        description: 'Must exactly match one of the options',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddQuestionDto.prototype, "correctAnswer", void 0);
//# sourceMappingURL=add-question.dto.js.map