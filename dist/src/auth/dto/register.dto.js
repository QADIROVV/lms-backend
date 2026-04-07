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
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class RegisterDto {
    constructor() {
        this.role = client_1.Role.STUDENT;
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, minimum: 5, maximum: 100 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], RegisterDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{7,14}$/, { message: 'Phone must be a valid phone number' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street, City, Country' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SecurePass123!', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Role, default: client_1.Role.STUDENT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Role),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
//# sourceMappingURL=register.dto.js.map