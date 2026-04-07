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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const client_1 = require("@prisma/client");
const USER_SELECT = {
    id: true,
    fullName: true,
    age: true,
    phone: true,
    address: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: USER_SELECT,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, pagination_query_dto_1.paginate)(users, total, page, limit);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: USER_SELECT,
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByRole(role, query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = { role };
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: USER_SELECT,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, pagination_query_dto_1.paginate)(users, total, page, limit);
    }
    async update(id, dto, requestingUserId, requestingUserRole) {
        await this.findOne(id);
        if (requestingUserRole !== client_1.Role.ADMIN && requestingUserId !== id) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        const data = { ...dto };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
        }
        if (dto.role && requestingUserRole !== client_1.Role.ADMIN) {
            delete data.role;
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data,
            select: USER_SELECT,
        });
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.delete({ where: { id } });
        return { message: `User ${id} deleted successfully` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map