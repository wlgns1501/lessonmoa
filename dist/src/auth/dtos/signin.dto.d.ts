import { User } from 'src/entities/user.entity';
declare const SignInDto_base: import("@nestjs/common").Type<Pick<User, "email" | "password">>;
export declare class SignInDto extends SignInDto_base {
}
export {};
