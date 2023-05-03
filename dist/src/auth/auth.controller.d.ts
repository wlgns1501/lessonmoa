import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
export declare const REFRESH_TOKEN_EXPRIRESIN: number;
export declare class AuthController {
    private service;
    constructor(service: AuthService);
    private setAccessToken;
    private setRefreshToken;
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
    }>;
    signIn(signInDto: SignInDto, response: Response): Promise<void>;
    logout(req: any, response: Response): Promise<void>;
    signout(req: any, response: Response): Promise<void>;
}
