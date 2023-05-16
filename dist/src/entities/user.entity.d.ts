import { BaseEntity } from 'typeorm';
import { License } from './license.entity';
import { Lesson } from './lesson.entity';
import { UserLesson } from './user_lesson.entity';
import { Location } from './location.entity';
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
    userLessons: UserLesson[];
    location: Location;
    hashedPassword(): Promise<void>;
    validatedPassword(password: string): Promise<boolean>;
    toJSON(): Record<string, any>;
}
declare const UserInfo_base: import("@nestjs/common").Type<Pick<User, "email" | "nickname" | "password">>;
export declare class UserInfo extends UserInfo_base {
}
export {};
