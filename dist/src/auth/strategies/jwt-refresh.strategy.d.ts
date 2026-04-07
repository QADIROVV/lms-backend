import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(req: Request, payload: {
        sub: string;
        phone: string;
        role: string;
    }): Promise<{
        refreshToken: string;
        sub: string;
        phone: string;
        role: string;
    }>;
}
export {};
