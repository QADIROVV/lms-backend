import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PaginationQueryDto, paginate } from '../common/dto/pagination-query.dto';
import { Role, EnrollmentStatus } from '@prisma/client';

const ENROLLMENT_SELECT = {
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  student: {
    select: { id: true, fullName: true, phone: true, age: true },
  },
  course: {
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      teacher: { select: { id: true, fullName: true } },
    },
  },
};

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(dto: CreateEnrollmentDto, studentId: string) {
    // Verify course exists
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Course not found');

    // Check already enrolled
    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId: dto.courseId } },
    });

    if (existing) {
      if (existing.status === EnrollmentStatus.ACTIVE) {
        throw new ConflictException('You are already enrolled in this course');
      }
      // Re-enroll if previously dropped
      return this.prisma.enrollment.update({
        where: { id: existing.id },
        data: { status: EnrollmentStatus.ACTIVE },
        select: ENROLLMENT_SELECT,
      });
    }

    return this.prisma.enrollment.create({
      data: { studentId, courseId: dto.courseId },
      select: ENROLLMENT_SELECT,
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        select: ENROLLMENT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.enrollment.count(),
    ]);

    return paginate(enrollments, total, page, limit);
  }

  async findMyEnrollments(studentId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = { studentId };

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        select: ENROLLMENT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    return paginate(enrollments, total, page, limit);
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      select: ENROLLMENT_SELECT,
    });
    if (!enrollment) throw new NotFoundException(`Enrollment with ID ${id} not found`);
    return enrollment;
  }

  async updateStatus(
    id: string,
    dto: UpdateEnrollmentDto,
    userId: string,
    userRole: Role,
  ) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');

    // Students can only drop their own enrollments
    if (userRole === Role.STUDENT) {
      if (enrollment.studentId !== userId) {
        throw new ForbiddenException('You can only manage your own enrollments');
      }
      if (dto.status !== EnrollmentStatus.DROPPED) {
        throw new ForbiddenException('Students can only drop from a course');
      }
    }

    // Teachers can only manage enrollments of their own courses
    if (userRole === Role.TEACHER) {
      if (enrollment.course.teacherId !== userId) {
        throw new ForbiddenException('You can only manage enrollments of your own courses');
      }
    }

    return this.prisma.enrollment.update({
      where: { id },
      data: { status: dto.status },
      select: ENROLLMENT_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.enrollment.delete({ where: { id } });
    return { message: `Enrollment ${id} deleted successfully` };
  }
}
