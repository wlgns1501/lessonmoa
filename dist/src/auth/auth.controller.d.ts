import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
export declare class AuthController {
    private service;
    constructor(service: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
    }>;
    signIn(signInDto: SignInDto, response: Response): Promise<void>;
}
