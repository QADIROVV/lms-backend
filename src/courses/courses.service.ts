import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { PaginationQueryDto, paginate } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';

const COURSE_SELECT = {
  id: true,
  name: true,
  description: true,
  price: true,
  duration: true,
  createdAt: true,
  updatedAt: true,
  teacher: {
    select: { id: true, fullName: true, phone: true },
  },
  _count: {
    select: { enrollments: true, homeworks: true, tests: true },
  },
};

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    // Validate teacher exists and has TEACHER role
    const teacher = await this.prisma.user.findUnique({
      where: { id: dto.teacherId },
    });

    if (!teacher) throw new NotFoundException('Teacher not found');
    if (teacher.role !== Role.TEACHER)
      throw new BadRequestException('Assigned user must have TEACHER role');

    return this.prisma.course.create({
      data: dto,
      select: COURSE_SELECT,
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        select: COURSE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return paginate(courses, total, page, limit);
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: COURSE_SELECT,
    });

    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);
    return course;
  }

  async findByTeacher(teacherId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { teacherId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        select: COURSE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return paginate(courses, total, page, limit);
  }

  async update(id: string, dto: UpdateCourseDto, userId: string, userRole: Role) {
    const course = await this.findOne(id);

    if (userRole === Role.TEACHER && (course as any).teacher.id !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    if (dto.teacherId) {
      const teacher = await this.prisma.user.findUnique({ where: { id: dto.teacherId } });
      if (!teacher) throw new NotFoundException('Teacher not found');
      if (teacher.role !== Role.TEACHER)
        throw new BadRequestException('Assigned user must have TEACHER role');
    }

    return this.prisma.course.update({
      where: { id },
      data: dto,
      select: COURSE_SELECT,
    });
  }

  async assignTeacher(id: string, dto: AssignTeacherDto) {
    await this.findOne(id);

    const teacher = await this.prisma.user.findUnique({ where: { id: dto.teacherId } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (teacher.role !== Role.TEACHER)
      throw new BadRequestException('Assigned user must have TEACHER role');

    return this.prisma.course.update({
      where: { id },
      data: { teacherId: dto.teacherId },
      select: COURSE_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.course.delete({ where: { id } });
    return { message: `Course ${id} deleted successfully` };
  }

  async getCourseStudents(courseId: string, teacherId: string, query: PaginationQueryDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.teacherId !== teacherId)
      throw new ForbiddenException('You can only view students of your own courses');

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { courseId },
        include: {
          student: {
            select: { id: true, fullName: true, phone: true, age: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.enrollment.count({ where: { courseId } }),
    ]);

    return paginate(enrollments, total, page, limit);
  }
}
