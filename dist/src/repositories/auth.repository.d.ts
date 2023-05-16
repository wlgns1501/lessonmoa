import { SignUpDto } from 'src/auth/dtos/signup.dto';
import { User } from 'src/entities/user.entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Location } from 'src/entities/location.entity';
export declare class AuthRepository extends BaseRepository<User> {
    signUp(signUpDto: SignUpDto, location: Location): Promise<import("typeorm").InsertResult>;
    signOut(userId: number): Promise<import("typeorm").DeleteResult>;
}
