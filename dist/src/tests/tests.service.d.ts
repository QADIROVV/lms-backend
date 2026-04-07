import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';
export declare class TestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTest(dto: CreateTestDto, teacherId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        _count: {
            results: number;
            questions: number;
        };
    }>;
    findAllTests(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        _count: {
            results: number;
            questions: number;
        };
    }>>;
    findTestsByCourse(courseId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        _count: {
            results: number;
            questions: number;
        };
    }>>;
    findTestById(id: string, includeAnswers?: boolean): Promise<{
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        questions: {
            id: string;
            text: string;
            options: string[];
            correctAnswer: string;
        }[];
        _count: {
            results: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
    }>;
    updateTest(id: string, dto: UpdateTestDto, teacherId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        title: string;
        _count: {
            results: number;
            questions: number;
        };
    }>;
    deleteTest(id: string, userId: string, role: Role): Promise<{
        message: string;
    }>;
    addQuestion(testId: string, dto: AddQuestionDto, teacherId: string): Promise<{
        id: string;
        createdAt: Date;
        testId: string;
        text: string;
        options: string[];
        correctAnswer: string;
    }>;
    deleteQuestion(questionId: string, teacherId: string): Promise<{
        message: string;
    }>;
    submitTest(testId: string, dto: SubmitTestDto, studentId: string): Promise<{
        resultId: string;
        test: {
            id: string;
            title: string;
        };
        student: {
            id: string;
            fullName: string;
        };
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
        grade: string;
        answers: ({
            question: {
                text: string;
                options: string[];
                correctAnswer: string;
            };
        } & {
            id: string;
            createdAt: Date;
            answer: string;
            questionId: string;
            isCorrect: boolean;
            resultId: string;
        })[];
    }>;
    private calculateGrade;
}
