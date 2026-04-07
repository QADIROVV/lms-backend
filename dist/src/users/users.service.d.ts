import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        phone: string;
        fullName: string;
        age: number;
        address: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findOne(id: string): Promise<{
        id: string;
        phone: string;
        fullName: string;
        age: number;
        address: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByRole(role: Role, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        phone: string;
        fullName: string;
        age: number;
        address: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    update(id: string, dto: UpdateUserDto, requestingUserId: string, requestingUserRole: Role): Promise<{
        id: string;
        phone: string;
        fullName: string;
        age: number;
        address: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
