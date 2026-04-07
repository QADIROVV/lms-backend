import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    fullName?: string;
    age?: number;
    phone?: string;
    address?: string;
    password?: string;
    role?: Role;
}
