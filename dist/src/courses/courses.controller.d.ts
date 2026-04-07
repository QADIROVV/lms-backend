import { Role } from '@prisma/client';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(dto: CreateCourseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        duration: number;
        teacher: {
            id: string;
            phone: string;
            fullName: string;
        };
        _count: {
            enrollments: number;
            homeworks: number;
            tests: number;
        };
    }>;
    findAll(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        duration: number;
        teacher: {
            id: string;
            phone: string;
            fullName: string;
        };
        _count: {
            enrollments: number;
            homeworks: number;
            tests: number;
        };
    }>>;
    findMyCourses(teacherId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        duration: number;
        teacher: {
            id: string;
            phone: string;
            fullName: string;
        };
        _count: {
            enrollments: number;
            homeworks: number;
            tests: number;
        };
    }>>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        duration: number;
        teacher: {
            id: string;
            phone: string;
            fullName: string;
        };
        _count: {
            enrollments: number;
            homeworks: number;
            tests: number;
        };
    }>;
    getCourseStudents(id: string, teacherId: string, role: Role, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        student: {
            id: string;
            phone: string;
            fullName: string;
            age: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
    }>>;
    update(id: string, dto: UpdateCourseDto, userId: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        duration: number;
        teacher: {
            id: string;
            phone: string;
            fullName: string;
        };
        _count: {
            enrollments: number;
            homeworks: number;
            tests: number;
        };
    }>;
    assignTeacher(id: string, dto: AssignTeacherDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        duration: number;
        teacher: {
            id: string;
            phone: string;
            fullName: string;
        };
        _count: {
            enrollments: number;
            homeworks: number;
            tests: number;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
