import { User } from 'src/entities/user.entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
export declare class UserRepository extends BaseRepository<User> {
    updateUserIsInstructor(userId: number): Promise<import("typeorm").UpdateResult>;
}
