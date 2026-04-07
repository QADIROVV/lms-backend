"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const admin = await prisma.user.upsert({
        where: { phone: '+1000000001' },
        update: {},
        create: {
            fullName: 'System Admin',
            age: 35,
            phone: '+1000000001',
            address: '123 Admin Street, City',
            role: client_1.Role.ADMIN,
            password: adminPassword,
        },
    });
    console.log(`✅ Admin created: ${admin.fullName} (${admin.phone})`);
    const teacherPassword = await bcrypt.hash('teacher123', saltRounds);
    const teacher = await prisma.user.upsert({
        where: { phone: '+1000000002' },
        update: {},
        create: {
            fullName: 'John Teacher',
            age: 40,
            phone: '+1000000002',
            address: '456 Teacher Ave, City',
            role: client_1.Role.TEACHER,
            password: teacherPassword,
        },
    });
    console.log(`✅ Teacher created: ${teacher.fullName} (${teacher.phone})`);
    const teacher2Password = await bcrypt.hash('teacher123', saltRounds);
    const teacher2 = await prisma.user.upsert({
        where: { phone: '+1000000003' },
        update: {},
        create: {
            fullName: 'Jane Educator',
            age: 38,
            phone: '+1000000003',
            address: '789 Educator Blvd, City',
            role: client_1.Role.TEACHER,
            password: teacher2Password,
        },
    });
    console.log(`✅ Teacher2 created: ${teacher2.fullName} (${teacher2.phone})`);
    const studentPassword = await bcrypt.hash('student123', saltRounds);
    const student1 = await prisma.user.upsert({
        where: { phone: '+1000000004' },
        update: {},
        create: {
            fullName: 'Alice Student',
            age: 22,
            phone: '+1000000004',
            address: '321 Student Road, City',
            role: client_1.Role.STUDENT,
            password: studentPassword,
        },
    });
    const student2 = await prisma.user.upsert({
        where: { phone: '+1000000005' },
        update: {},
        create: {
            fullName: 'Bob Learner',
            age: 24,
            phone: '+1000000005',
            address: '654 Learner Lane, City',
            role: client_1.Role.STUDENT,
            password: studentPassword,
        },
    });
    const student3 = await prisma.user.upsert({
        where: { phone: '+1000000006' },
        update: {},
        create: {
            fullName: 'Carol Scholar',
            age: 21,
            phone: '+1000000006',
            address: '987 Scholar Street, City',
            role: client_1.Role.STUDENT,
            password: studentPassword,
        },
    });
    console.log('✅ Students created: Alice, Bob, Carol');
    const course1 = await prisma.course.upsert({
        where: { id: 'course-seed-001' },
        update: {},
        create: {
            id: 'course-seed-001',
            name: 'Introduction to JavaScript',
            description: 'Learn the fundamentals of JavaScript programming language from scratch.',
            price: 99.99,
            duration: 30,
            teacherId: teacher.id,
        },
    });
    const course2 = await prisma.course.upsert({
        where: { id: 'course-seed-002' },
        update: {},
        create: {
            id: 'course-seed-002',
            name: 'Advanced TypeScript',
            description: 'Deep dive into TypeScript with advanced types, generics, and patterns.',
            price: 149.99,
            duration: 45,
            teacherId: teacher.id,
        },
    });
    const course3 = await prisma.course.upsert({
        where: { id: 'course-seed-003' },
        update: {},
        create: {
            id: 'course-seed-003',
            name: 'NestJS Masterclass',
            description: 'Build production-ready APIs with NestJS framework.',
            price: 199.99,
            duration: 60,
            teacherId: teacher2.id,
        },
    });
    console.log('✅ Courses created: JavaScript, TypeScript, NestJS');
    await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: student1.id, courseId: course1.id } },
        update: {},
        create: { studentId: student1.id, courseId: course1.id, status: 'ACTIVE' },
    });
    await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: student1.id, courseId: course2.id } },
        update: {},
        create: { studentId: student1.id, courseId: course2.id, status: 'ACTIVE' },
    });
    await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: student2.id, courseId: course1.id } },
        update: {},
        create: { studentId: student2.id, courseId: course1.id, status: 'DROPPED' },
    });
    await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: student2.id, courseId: course3.id } },
        update: {},
        create: { studentId: student2.id, courseId: course3.id, status: 'ACTIVE' },
    });
    await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: student3.id, courseId: course1.id } },
        update: {},
        create: { studentId: student3.id, courseId: course1.id, status: 'ACTIVE' },
    });
    console.log('✅ Enrollments created');
    const homework1 = await prisma.homework.upsert({
        where: { id: 'hw-seed-001' },
        update: {},
        create: {
            id: 'hw-seed-001',
            title: 'Variables and Data Types',
            description: 'Create a JS file demonstrating all primitive data types with examples.',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            courseId: course1.id,
        },
    });
    console.log('✅ Homework created');
    const test1 = await prisma.test.upsert({
        where: { id: 'test-seed-001' },
        update: {},
        create: {
            id: 'test-seed-001',
            title: 'JavaScript Basics Quiz',
            courseId: course1.id,
        },
    });
    await prisma.question.upsert({
        where: { id: 'q-seed-001' },
        update: {},
        create: {
            id: 'q-seed-001',
            testId: test1.id,
            text: 'Which keyword is used to declare a constant in JavaScript?',
            options: ['var', 'let', 'const', 'def'],
            correctAnswer: 'const',
        },
    });
    await prisma.question.upsert({
        where: { id: 'q-seed-002' },
        update: {},
        create: {
            id: 'q-seed-002',
            testId: test1.id,
            text: 'What does typeof null return in JavaScript?',
            options: ['null', 'undefined', 'object', 'string'],
            correctAnswer: 'object',
        },
    });
    await prisma.question.upsert({
        where: { id: 'q-seed-003' },
        update: {},
        create: {
            id: 'q-seed-003',
            testId: test1.id,
            text: 'Which method adds an element to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 'push()',
        },
    });
    console.log('✅ Tests and questions created');
    console.log('\n🎉 Seeding completed!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Admin:   phone: +1000000001  password: admin123');
    console.log('  Teacher: phone: +1000000002  password: teacher123');
    console.log('  Teacher: phone: +1000000003  password: teacher123');
    console.log('  Student: phone: +1000000004  password: student123');
    console.log('  Student: phone: +1000000005  password: student123');
    console.log('  Student: phone: +1000000006  password: student123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map