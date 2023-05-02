import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
export declare class AuthService {
    private readonly connection;
    private authRepository;
    constructor(connection: Connection);
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
    }>;
}
