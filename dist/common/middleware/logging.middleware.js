"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggingMiddleware = class LoggingMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(req, res, next) {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now();
        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length');
            const responseTime = Date.now() - startTime;
            const logMessage = `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength || 0}b - ${userAgent} ${ip}`;
            if (statusCode >= 500) {
                this.logger.error(logMessage);
            }
            else if (statusCode >= 400) {
                this.logger.warn(logMessage);
            }
            else {
                this.logger.log(logMessage);
            }
        });
        next();
    }
};
exports.LoggingMiddleware = LoggingMiddleware;
exports.LoggingMiddleware = LoggingMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggingMiddleware);
//# sourceMappingURL=logging.middleware.js.map