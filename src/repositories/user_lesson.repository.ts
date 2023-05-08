import { Lesson } from 'src/entities/lesson.entity';
import { User } from 'src/entities/user.entity';
import { UserLesson } from 'src/entities/user_lesson.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(UserLesson)
export class UserLessonRepository extends BaseRepository<UserLesson> {
  async getUserId(user: User) {
    return await this.createQueryBuilder('ul').where({ user }).getOne();
  }

  async applyLesson(user: User, lesson: Lesson) {
    return await this.createQueryBuilder('ul')
      .insert()
      .into(UserLesson)
      .values({ user, lesson })
      .returning('*')
      .execute();
  }
}
