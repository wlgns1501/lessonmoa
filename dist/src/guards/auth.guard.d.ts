import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Connection } from 'typeorm';
export declare type JwtPayload = {
    email: string;
    isInstructor: boolean;
};
export declare class AuthGuard implements CanActivate {
    private readonly connection;
    private authRepository;
    constructor(connection: Connection);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
