import { Role } from '@prisma/client';
export declare class RegisterDto {
    fullName: string;
    age: number;
    phone: string;
    address: string;
    password: string;
    role?: Role;
}
