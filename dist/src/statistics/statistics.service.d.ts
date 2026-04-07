import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCourseStats(courseId: string, userId: string, userRole: Role): Promise<{
        course: {
            id: string;
            name: string;
            teacher: {
                id: string;
                fullName: string;
            };
        };
        enrollments: {
            total: number;
            active: number;
            dropped: number;
            dropRate: number;
        };
        content: {
            homeworks: number;
            tests: number;
        };
        performance: {
            totalTestSubmissions: number;
            averageScore: number;
            grade: string;
        };
    }>;
    getTeacherStats(teacherId: string, requesterId: string, requesterRole: Role): Promise<{
        teacher: {
            id: string;
            fullName: string;
        };
        summary: {
            totalCourses: number;
            totalEnrollments: number;
            activeStudents: number;
            droppedStudents: number;
            totalTestSubmissions: number;
            averageScore: number;
        };
        courses: {
            id: string;
            name: string;
            enrollments: number;
            homeworks: number;
            tests: number;
        }[];
    }>;
    getPlatformStats(): Promise<{
        users: {
            total: number;
            students: number;
            teachers: number;
            admins: number;
        };
        courses: {
            total: number;
        };
        enrollments: {
            total: number;
            active: number;
            dropped: number;
            dropRate: number;
        };
        homework: {
            total: number;
            totalSubmissions: number;
            submissionRate: number;
        };
        tests: {
            total: number;
            totalSubmissions: number;
            averageScore: number;
        };
    }>;
    getStudentStats(studentId: string, requesterId: string, requesterRole: Role): Promise<{
        student: {
            id: string;
            fullName: string;
        };
        enrollments: {
            total: number;
            active: number;
            dropped: number;
            activeCourses: {
                id: string;
                name: string;
            }[];
        };
        homework: {
            totalSubmissions: number;
        };
        tests: {
            totalAttempted: number;
            averageScore: number;
            bestResult: {
                test: string;
                course: string;
                score: number;
                correct: number;
                wrong: number;
            };
            recentResults: {
                test: {
                    course: {
                        name: string;
                    };
                    title: string;
                };
                totalQuestions: number;
                correctCount: number;
                wrongCount: number;
                percentage: number;
            }[];
        };
    }>;
    getCourseLeaderboard(courseId: string, userId: string, userRole: Role): Promise<{
        course: {
            id: string;
            name: string;
        };
        leaderboard: {
            rank: number;
            student: any;
            bestScore: number;
            grade: string;
            testAttempts: number;
        }[];
    }>;
    private calculateGrade;
}
