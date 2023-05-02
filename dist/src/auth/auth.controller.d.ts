import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
export declare class AuthController {
    private service;
    constructor(service: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
    }>;
}
