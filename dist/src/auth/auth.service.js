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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { phone: dto.phone },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                age: dto.age,
                phone: dto.phone,
                address: dto.address,
                role: dto.role,
                password: hashedPassword,
            },
            select: {
                id: true,
                fullName: true,
                age: true,
                phone: true,
                address: true,
                role: true,
                createdAt: true,
            },
        });
        this.logger.log(`New user registered: ${user.phone} (${user.role})`);
        const tokens = await this.generateTokens(user.id, user.phone, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return { user, ...tokens };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { phone: dto.phone },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log(`User logged in: ${user.phone}`);
        const tokens = await this.generateTokens(user.id, user.phone, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, ...tokens };
    }
    async refreshTokens(userId, refreshToken) {
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: {
                userId,
                token: refreshToken,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const tokens = await this.generateTokens(storedToken.user.id, storedToken.user.phone, storedToken.user.role);
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
        await this.saveRefreshToken(userId, tokens.refreshToken);
        return tokens;
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId, token: refreshToken },
        });
        return { message: 'Logged out successfully' };
    }
    async generateTokens(userId, phone, role) {
        const payload = { sub: userId, phone, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: { userId, token, expiresAt },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map