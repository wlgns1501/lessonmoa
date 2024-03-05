import { User } from 'src/entities/user.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  async changeIsInstructorUser(userId: number, status: boolean) {
    return await this.createQueryBuilder()
      .update(User)
      .set({ isInstructor: status })
      .where({ id: userId })
      .execute();
  }
}
