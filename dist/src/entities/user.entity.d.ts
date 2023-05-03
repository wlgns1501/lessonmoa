import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: number;
    email: string;
    password: string;
    nickname: string;
    isInstructor: boolean;
    createdAt: string;
    hashedPassword(): Promise<void>;
    validatedPassword(password: string): Promise<boolean>;
}
declare const UserInfo_base: import("@nestjs/common").Type<Pick<User, "email" | "nickname" | "password">>;
export declare class UserInfo extends UserInfo_base {
}
export {};
