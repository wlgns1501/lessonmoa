import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { User } from 'src/entities/user.entity';
export declare class AuthService {
    private readonly connection;
    private authRepository;
    constructor(connection: Connection);
    private getAccessToken;
    private getRefreshToken;
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signOut(user: User): Promise<void>;
}
