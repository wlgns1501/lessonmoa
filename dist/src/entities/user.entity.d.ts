import { BaseEntity } from 'typeorm';
import { License } from './license.entity';
import { Lesson } from './lesson.entity';
export declare class User extends BaseEntity {
    id: number;
    email: string;
    password: string;
    nickname: string;
    isInstructor: boolean;
    isAdmin: boolean;
    createdAt: string;
    licenses: License[];
    lessons: Lesson[];
    hashedPassword(): Promise<void>;
    validatedPassword(password: string): Promise<boolean>;
    toJSON(): Record<string, any>;
}
declare const UserInfo_base: import("@nestjs/common").Type<Pick<User, "email" | "password" | "nickname">>;
export declare class UserInfo extends UserInfo_base {
}
export {};
