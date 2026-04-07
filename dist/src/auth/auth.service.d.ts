import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
            address: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
            address: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private saveRefreshToken;
}
