import { Role } from '@prisma/client';
import { ResultsService } from './results.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    findAll(query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        test: {
            id: string;
            course: {
                id: string;
                name: string;
            };
            title: string;
        };
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
    }>>;
    findMyResults(studentId: string, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        test: {
            id: string;
            course: {
                id: string;
                name: string;
            };
            title: string;
        };
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
    }>>;
    findByTest(testId: string, userId: string, userRole: Role, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        test: {
            id: string;
            course: {
                id: string;
                name: string;
            };
            title: string;
        };
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
    }>>;
    findByStudent(studentId: string, requesterId: string, requesterRole: Role, query: PaginationQueryDto): Promise<import("../common/dto/pagination-query.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        test: {
            id: string;
            course: {
                id: string;
                name: string;
            };
            title: string;
        };
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
    }>>;
    findById(id: string, userId: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        student: {
            id: string;
            phone: string;
            fullName: string;
        };
        test: {
            id: string;
            course: {
                id: string;
                name: string;
            };
            title: string;
        };
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
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
    } & {
        id: string;
        createdAt: Date;
        studentId: string;
        testId: string;
        totalQuestions: number;
        correctCount: number;
        wrongCount: number;
        percentage: number;
    }>;
}
