import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, EnrollmentStatus } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Course Statistics ────────────────────────────────────────────────────────

  async getCourseStats(courseId: string, userId: string, userRole: Role) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { teacher: { select: { id: true, fullName: true } } },
    });

    if (!course) throw new NotFoundException(`Course with ID ${courseId} not found`);

    if (userRole === Role.TEACHER && course.teacherId !== userId) {
      throw new ForbiddenException('You can only view statistics for your own courses');
    }

    const [totalStudents, activeStudents, droppedStudents, results, homeworkCount, testCount] =
      await Promise.all([
        this.prisma.enrollment.count({ where: { courseId } }),
        this.prisma.enrollment.count({ where: { courseId, status: EnrollmentStatus.ACTIVE } }),
        this.prisma.enrollment.count({ where: { courseId, status: EnrollmentStatus.DROPPED } }),
        this.prisma.result.findMany({
          where: { test: { courseId } },
          select: { percentage: true },
        }),
        this.prisma.homework.count({ where: { courseId } }),
        this.prisma.test.count({ where: { courseId } }),
      ]);

    const averageScore =
      results.length > 0
        ? Math.round(
            (results.reduce((sum, r) => sum + r.percentage, 0) / results.length) * 100,
          ) / 100
        : 0;

    return {
      course: {
        id: course.id,
        name: course.name,
        teacher: course.teacher,
      },
      enrollments: {
        total: totalStudents,
        active: activeStudents,
        dropped: droppedStudents,
        dropRate:
          totalStudents > 0
            ? Math.round((droppedStudents / totalStudents) * 10000) / 100
            : 0,
      },
      content: {
        homeworks: homeworkCount,
        tests: testCount,
      },
      performance: {
        totalTestSubmissions: results.length,
        averageScore,
        grade: this.calculateGrade(averageScore),
      },
    };
  }

  // ─── Teacher Dashboard ────────────────────────────────────────────────────────

  async getTeacherStats(teacherId: string, requesterId: string, requesterRole: Role) {
    if (requesterRole === Role.TEACHER && teacherId !== requesterId) {
      throw new ForbiddenException('You can only view your own statistics');
    }

    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { id: true, fullName: true, role: true },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (teacher.role !== Role.TEACHER)
      throw new ForbiddenException('User is not a teacher');

    const courses = await this.prisma.course.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        _count: {
          select: { enrollments: true, homeworks: true, tests: true },
        },
      },
    });

    const courseIds = courses.map((c) => c.id);

    const [totalActive, totalDropped, allResults] = await Promise.all([
      this.prisma.enrollment.count({
        where: { courseId: { in: courseIds }, status: EnrollmentStatus.ACTIVE },
      }),
      this.prisma.enrollment.count({
        where: { courseId: { in: courseIds }, status: EnrollmentStatus.DROPPED },
      }),
      this.prisma.result.findMany({
        where: { test: { courseId: { in: courseIds } } },
        select: { percentage: true },
      }),
    ]);

    const totalEnrollments = totalActive + totalDropped;
    const averageScore =
      allResults.length > 0
        ? Math.round(
            (allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length) * 100,
          ) / 100
        : 0;

    return {
      teacher: { id: teacher.id, fullName: teacher.fullName },
      summary: {
        totalCourses: courses.length,
        totalEnrollments,
        activeStudents: totalActive,
        droppedStudents: totalDropped,
        totalTestSubmissions: allResults.length,
        averageScore,
      },
      courses: courses.map((c) => ({
        id: c.id,
        name: c.name,
        enrollments: c._count.enrollments,
        homeworks: c._count.homeworks,
        tests: c._count.tests,
      })),
    };
  }

  // ─── Global Platform Stats (Admin) ───────────────────────────────────────────

  async getPlatformStats() {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalCourses,
      totalEnrollments,
      activeEnrollments,
      droppedEnrollments,
      totalHomeworks,
      totalSubmissions,
      totalTests,
      totalResults,
      allResults,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.STUDENT } }),
      this.prisma.user.count({ where: { role: Role.TEACHER } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.course.count(),
      this.prisma.enrollment.count(),
      this.prisma.enrollment.count({ where: { status: EnrollmentStatus.ACTIVE } }),
      this.prisma.enrollment.count({ where: { status: EnrollmentStatus.DROPPED } }),
      this.prisma.homework.count(),
      this.prisma.submission.count(),
      this.prisma.test.count(),
      this.prisma.result.count(),
      this.prisma.result.findMany({ select: { percentage: true } }),
    ]);

    const averageScore =
      allResults.length > 0
        ? Math.round(
            (allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length) * 100,
          ) / 100
        : 0;

    return {
      users: {
        total: totalUsers,
        students: totalStudents,
        teachers: totalTeachers,
        admins: totalAdmins,
      },
      courses: {
        total: totalCourses,
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
        dropped: droppedEnrollments,
        dropRate:
          totalEnrollments > 0
            ? Math.round((droppedEnrollments / totalEnrollments) * 10000) / 100
            : 0,
      },
      homework: {
        total: totalHomeworks,
        totalSubmissions,
        submissionRate:
          totalHomeworks > 0
            ? Math.round((totalSubmissions / totalHomeworks) * 100)
            : 0,
      },
      tests: {
        total: totalTests,
        totalSubmissions: totalResults,
        averageScore,
      },
    };
  }

  // ─── Student Personal Stats ───────────────────────────────────────────────────

  async getStudentStats(studentId: string, requesterId: string, requesterRole: Role) {
    if (requesterRole === Role.STUDENT && studentId !== requesterId) {
      throw new ForbiddenException('You can only view your own statistics');
    }

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, fullName: true, role: true },
    });
    if (!student) throw new NotFoundException('Student not found');
    if (student.role !== Role.STUDENT)
      throw new ForbiddenException('User is not a student');

    const [enrollments, submissions, results] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { studentId },
        select: {
          status: true,
          course: { select: { id: true, name: true } },
        },
      }),
      this.prisma.submission.count({ where: { studentId } }),
      this.prisma.result.findMany({
        where: { studentId },
        select: {
          percentage: true,
          correctCount: true,
          wrongCount: true,
          totalQuestions: true,
          test: { select: { title: true, course: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const activeEnrollments = enrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE);
    const droppedEnrollments = enrollments.filter((e) => e.status === EnrollmentStatus.DROPPED);

    const averageScore =
      results.length > 0
        ? Math.round(
            (results.reduce((sum, r) => sum + r.percentage, 0) / results.length) * 100,
          ) / 100
        : 0;

    const bestResult = results.reduce(
      (best, r) => (!best || r.percentage > best.percentage ? r : best),
      null as typeof results[0] | null,
    );

    return {
      student: { id: student.id, fullName: student.fullName },
      enrollments: {
        total: enrollments.length,
        active: activeEnrollments.length,
        dropped: droppedEnrollments.length,
        activeCourses: activeEnrollments.map((e) => e.course),
      },
      homework: {
        totalSubmissions: submissions,
      },
      tests: {
        totalAttempted: results.length,
        averageScore,
        bestResult: bestResult
          ? {
              test: bestResult.test.title,
              course: bestResult.test.course.name,
              score: bestResult.percentage,
              correct: bestResult.correctCount,
              wrong: bestResult.wrongCount,
            }
          : null,
        recentResults: results.slice(0, 5),
      },
    };
  }

  // ─── Leaderboard ──────────────────────────────────────────────────────────────

  async getCourseLeaderboard(courseId: string, userId: string, userRole: Role) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    if (userRole === Role.TEACHER && course.teacherId !== userId) {
      throw new ForbiddenException('You can only view leaderboard for your own courses');
    }

    const results = await this.prisma.result.findMany({
      where: { test: { courseId } },
      include: {
        student: { select: { id: true, fullName: true } },
        test: { select: { title: true } },
      },
      orderBy: { percentage: 'desc' },
    });

    // Aggregate by student — use best score per student
    const studentMap = new Map<string, { student: any; bestScore: number; attempts: number }>();

    for (const result of results) {
      const existing = studentMap.get(result.studentId);
      if (!existing) {
        studentMap.set(result.studentId, {
          student: result.student,
          bestScore: result.percentage,
          attempts: 1,
        });
      } else {
        existing.attempts++;
        if (result.percentage > existing.bestScore) {
          existing.bestScore = result.percentage;
        }
      }
    }

    const leaderboard = Array.from(studentMap.values())
      .sort((a, b) => b.bestScore - a.bestScore)
      .map((entry, index) => ({
        rank: index + 1,
        student: entry.student,
        bestScore: entry.bestScore,
        grade: this.calculateGrade(entry.bestScore),
        testAttempts: entry.attempts,
      }));

    return {
      course: { id: course.id, name: course.name },
      leaderboard,
    };
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
}
