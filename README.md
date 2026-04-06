# 🎓 LMS Backend — Learning Management System

A production-ready REST API built with **NestJS**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/lms_db?schema=public"
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed Demo Data

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run start:dev
```

### 6. Open Swagger UI

```
http://localhost:3000/api
```

---

## 👥 Demo Accounts (after seeding)

| Role    | Phone         | Password     |
|---------|---------------|--------------|
| Admin   | +1000000001   | admin123     |
| Teacher | +1000000002   | teacher123   |
| Teacher | +1000000003   | teacher123   |
| Student | +1000000004   | student123   |
| Student | +1000000005   | student123   |
| Student | +1000000006   | student123   |

---

## 🏗️ Architecture

```
src/
├── auth/                    # JWT authentication (login, register, refresh)
│   ├── dto/
│   ├── strategies/          # Passport JWT strategies
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── users/                   # User management (CRUD, RBAC)
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
│
├── courses/                 # Course CRUD, teacher assignment
│   ├── dto/
│   ├── courses.controller.ts
│   ├── courses.module.ts
│   └── courses.service.ts
│
├── enrollments/             # Student enrollment, status tracking
│   ├── dto/
│   ├── enrollments.controller.ts
│   ├── enrollments.module.ts
│   └── enrollments.service.ts
│
├── homework/                # Homework + student submissions
│   ├── dto/
│   ├── homework.controller.ts
│   ├── homework.module.ts
│   └── homework.service.ts
│
├── tests/                   # MCQ tests, auto-grading, questions
│   ├── dto/
│   ├── tests.controller.ts
│   ├── tests.module.ts
│   └── tests.service.ts
│
├── results/                 # View test results
│   ├── results.controller.ts
│   ├── results.module.ts
│   └── results.service.ts
│
├── statistics/              # Analytics: course, teacher, student, platform
│   ├── statistics.controller.ts
│   ├── statistics.module.ts
│   └── statistics.service.ts
│
├── common/
│   ├── decorators/          # @CurrentUser, @Roles, @Public
│   ├── filters/             # Global HTTP exception filter
│   ├── guards/              # JwtAuthGuard, RolesGuard
│   ├── middleware/          # HTTP logging middleware
│   └── dto/                 # PaginationQueryDto
│
├── prisma/                  # PrismaService (global)
├── app.module.ts
└── main.ts
```

---

## 🔐 Authentication Flow

```
POST /api/v1/auth/register   → Register new user
POST /api/v1/auth/login      → Get accessToken + refreshToken
POST /api/v1/auth/refresh    → Rotate tokens
POST /api/v1/auth/logout     → Invalidate refresh token
GET  /api/v1/auth/me         → Current user profile
```

Include `Authorization: Bearer <accessToken>` on all protected routes.

---

## 📋 API Endpoints

### Auth
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /auth/register | Public | Register |
| POST | /auth/login | Public | Login |
| POST | /auth/refresh | Public | Refresh tokens |
| POST | /auth/logout | Any | Logout |
| GET | /auth/me | Any | Current user |

### Users
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /users | Admin | All users |
| GET | /users/teachers | Admin | All teachers |
| GET | /users/students | Admin, Teacher | All students |
| GET | /users/:id | Any | User by ID |
| PATCH | /users/:id | Admin, Self | Update user |
| DELETE | /users/:id | Admin | Delete user |

### Courses
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /courses | Admin | Create course |
| GET | /courses | Any | All courses |
| GET | /courses/my-courses | Teacher | Own courses |
| GET | /courses/:id | Any | Course by ID |
| GET | /courses/:id/students | Teacher, Admin | Course students |
| PATCH | /courses/:id | Admin, Teacher | Update course |
| PATCH | /courses/:id/assign-teacher | Admin | Assign teacher |
| DELETE | /courses/:id | Admin | Delete course |

### Enrollments
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /enrollments | Student | Enroll in course |
| GET | /enrollments | Admin | All enrollments |
| GET | /enrollments/my-enrollments | Student | Own enrollments |
| GET | /enrollments/:id | Any | Enrollment by ID |
| PATCH | /enrollments/:id/status | Any | Update status |
| DELETE | /enrollments/:id | Admin | Delete enrollment |

### Homework
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /homework | Teacher | Create homework |
| GET | /homework | Admin | All homework |
| GET | /homework/course/:courseId | Any | Homework by course |
| GET | /homework/:id | Any | Homework by ID |
| PATCH | /homework/:id | Teacher | Update homework |
| DELETE | /homework/:id | Teacher, Admin | Delete homework |
| POST | /homework/:homeworkId/submit | Student | Submit homework |
| GET | /homework/:homeworkId/submissions | Teacher, Admin | View submissions |
| GET | /homework/submissions/my | Student | Own submissions |

### Tests
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | /tests | Teacher | Create test |
| GET | /tests | Admin | All tests |
| GET | /tests/course/:courseId | Any | Tests by course |
| GET | /tests/:id | Any | Test (hides answers for students) |
| PATCH | /tests/:id | Teacher | Update test |
| DELETE | /tests/:id | Teacher, Admin | Delete test |
| POST | /tests/:testId/questions | Teacher | Add question |
| DELETE | /tests/questions/:questionId | Teacher | Delete question |
| POST | /tests/:testId/submit | Student | Submit test (auto-graded) |

### Results
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /results | Admin | All results |
| GET | /results/my-results | Student | Own results |
| GET | /results/test/:testId | Teacher, Admin | Results by test |
| GET | /results/student/:studentId | Any | Results by student |
| GET | /results/:id | Any | Result detail |

### Statistics
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | /statistics/platform | Admin | Platform-wide stats |
| GET | /statistics/my-dashboard | Teacher | Teacher dashboard |
| GET | /statistics/my-stats | Student | Student personal stats |
| GET | /statistics/teacher/:teacherId | Admin, Teacher | Teacher stats |
| GET | /statistics/student/:studentId | Any | Student stats |
| GET | /statistics/course/:courseId | Teacher, Admin | Course stats |
| GET | /statistics/course/:courseId/leaderboard | Any | Course leaderboard |

---

## 🛡️ RBAC Summary

| Feature | ADMIN | TEACHER | STUDENT |
|---------|-------|---------|---------|
| Manage users | ✅ | ❌ | ❌ |
| Create/delete courses | ✅ | ❌ | ❌ |
| Assign teacher to course | ✅ | ❌ | ❌ |
| Update own course | ✅ | ✅ (own) | ❌ |
| Create homework/tests | ✅ | ✅ (own) | ❌ |
| View course students | ✅ | ✅ (own) | ❌ |
| Enroll in course | ❌ | ❌ | ✅ |
| Submit homework | ❌ | ❌ | ✅ |
| Take tests | ❌ | ❌ | ✅ |
| View own results | ❌ | ❌ | ✅ |
| Platform statistics | ✅ | ❌ | ❌ |

---

## 📊 Database Schema

```
User         ─── taughtCourses ──▶ Course
User         ─── enrollments   ──▶ Enrollment ──▶ Course
User         ─── submissions   ──▶ Submission ──▶ Homework ──▶ Course
User         ─── results       ──▶ Result     ──▶ Test     ──▶ Course
Result       ─── answers       ──▶ Answer     ──▶ Question ──▶ Test
User         ─── refreshTokens ──▶ RefreshToken
```

---

## ⚙️ Scripts

```bash
npm run start:dev     # Development with hot reload
npm run start:prod    # Production
npm run build         # Compile TypeScript
npm run seed          # Seed demo data
npx prisma studio     # Visual DB browser
npx prisma migrate dev # Run migrations
```
