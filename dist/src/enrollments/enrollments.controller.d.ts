import { Role } from '@prisma/client';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enroll(dto: CreateEnrollmentDto, studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            price: number;
            duration: number;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        student: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
        };
    }>;
    findAll(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            price: number;
            duration: number;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        student: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
        };
    }>>;
    findMyEnrollments(studentId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            price: number;
            duration: number;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        student: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
        };
    }>>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            price: number;
            duration: number;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        student: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
        };
    }>;
    updateStatus(id: string, dto: UpdateEnrollmentDto, userId: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            price: number;
            duration: number;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        student: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
