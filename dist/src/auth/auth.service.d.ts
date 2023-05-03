import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
export declare class AuthService {
    private readonly connection;
    private authRepository;
    constructor(connection: Connection);
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
    }>;
    signIn(signInDto: SignInDto): Promise<void>;
}
