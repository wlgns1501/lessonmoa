import { SignUpDto } from 'src/auth/dtos/signup.dto';
import { User } from 'src/entities/user.entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
export declare class AuthRepository extends BaseRepository<User> {
    signUp(signUpDto: SignUpDto): Promise<User>;
    signOut(userId: number): Promise<import("typeorm").DeleteResult>;
}
