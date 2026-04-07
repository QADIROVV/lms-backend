import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';
export declare class HomeworkService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createHomework(dto: CreateHomeworkDto, teacherId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        deadline: Date;
        _count: {
            submissions: number;
        };
    }>;
    findAllHomework(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        deadline: Date;
        _count: {
            submissions: number;
        };
    }>>;
    findHomeworkByCourse(courseId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        deadline: Date;
        _count: {
            submissions: number;
        };
    }>>;
    findHomeworkById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        deadline: Date;
        _count: {
            submissions: number;
        };
    }>;
    updateHomework(id: string, dto: UpdateHomeworkDto, teacherId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        deadline: Date;
        _count: {
            submissions: number;
        };
    }>;
    deleteHomework(id: string, teacherId: string, role: Role): Promise<{
        message: string;
    }>;
    submitHomework(homeworkId: string, dto: SubmitHomeworkDto, studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        homework: {
            id: string;
            title: string;
            deadline: Date;
        };
        content: string;
        fileUrl: string;
    }>;
    findSubmissionsByHomework(homeworkId: string, teacherId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        homework: {
            id: string;
            title: string;
            deadline: Date;
        };
        content: string;
        fileUrl: string;
    }>>;
    findMySubmissions(studentId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        homework: {
            id: string;
            title: string;
            deadline: Date;
        };
        content: string;
        fileUrl: string;
    }>>;
}
