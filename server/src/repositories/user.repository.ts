import { User } from 'src/entities/user.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  async updateUserIsInstructor(userId: number) {
    return this.update({ id: userId }, { isInstructor: false });
  }
}
