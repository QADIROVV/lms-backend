"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const enrollments_module_1 = require("./enrollments/enrollments.module");
const homework_module_1 = require("./homework/homework.module");
const tests_module_1 = require("./tests/tests.module");
const results_module_1 = require("./results/results.module");
const statistics_module_1 = require("./statistics/statistics.module");
const prisma_module_1 = require("./prisma/prisma.module");
const logging_middleware_1 = require("./common/middleware/logging.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logging_middleware_1.LoggingMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            enrollments_module_1.EnrollmentsModule,
            homework_module_1.HomeworkModule,
            tests_module_1.TestsModule,
            results_module_1.ResultsModule,
            statistics_module_1.StatisticsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map