import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findTeachers(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        phone: string;
        fullName: string;
        age: number;
        address: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findStudents(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
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
