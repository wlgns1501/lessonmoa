import { Lesson } from 'src/entities/lesson.entity';
import { SubCategory } from 'src/entities/sub_category.entity';
import { User } from 'src/entities/user.entity';
import { CreateLessonDto } from 'src/lesson/dtos/create_lesson.dto';
import { GetLessonsDto } from 'src/lesson/dtos/get_lessons.dto';
import { UpdateLessonDto } from 'src/lesson/dtos/update_lesson.dto';
import { TYPE_UPDATE_PARTICIPANT } from 'src/lesson/lesson.service';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Lesson)
export class LessonRepository extends BaseRepository<Lesson> {
  async getLessons(getLessonsDto: GetLessonsDto) {
    const { page, pageSize } = getLessonsDto;

    return await this.createQueryBuilder('l')
      .leftJoinAndSelect('l.user', 'user')
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getMany();
  }

  async getLessonsBySubCategoryId(getLessonsDto: GetLessonsDto) {
    const { page, pageSize, subCategoryId } = getLessonsDto;

    return await this.createQueryBuilder('l')
      .leftJoinAndSelect('l.user', 'u')
      .leftJoinAndSelect('l.subCategory', 'sc')
      .where('sc.id = :subCategoryId', { subCategoryId })
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getMany();
  }

  async createLesson(
    user: User,
    createLessonDto: CreateLessonDto,
    subCategory: SubCategory,
  ) {
    const { name, userLimit, level, startDate, endDate, content } =
      createLessonDto;

    return await this.createQueryBuilder('lesson')
      .insert()
      .into('lesson')
      .values({
        name,
        content,
        userLimit,
        level,
        startDate,
        endDate,
        user,
        subCategory,
      })
      .returning('*')
      .execute();
  }

  async getLesson(lessonId: number) {
    return await this.createQueryBuilder('l')
      .leftJoinAndSelect('l.user', 'u')
      .leftJoinAndSelect('l.subCategory', 'sc')
      .leftJoinAndSelect('sc.category', 'c')
      .where({ id: lessonId })
      .getOne();
  }

  async updateLesson(
    lessonId: number,
    updateLessonDto: UpdateLessonDto,
    subCategory: SubCategory,
  ) {
    const { name, content, userLimit, level, startDate, endDate } =
      updateLessonDto;

    return await this.createQueryBuilder()
      .update(Lesson)
      .set({ name, content, userLimit, level, startDate, endDate, subCategory })
      .where({ id: lessonId })
      .returning('*')
      .execute();
  }

  async updateParticipantCount(lessonId: number, type: string) {
    switch (type) {
      case TYPE_UPDATE_PARTICIPANT.PLUS:
        return await this.createQueryBuilder('l')
          .update()
          .set({ participantCount: () => '"participantCount" + 1' })
          .where({ id: lessonId })
          .returning('"participantCount"')
          .execute();

      case TYPE_UPDATE_PARTICIPANT.MINUS:
        return await this.createQueryBuilder('l')
          .update()
          .set({ participantCount: () => '"participantCount" - 1' })
          .where({ id: lessonId })
          .andWhere('"participantCount" > 0 ')
          .returning('"participantCount"')
          .execute();
    }
  }

  async updateStatusLesson(lessonId: number, status: string) {
    return await this.createQueryBuilder('l')
      .update()
      .set({ status })
      .where({ id: lessonId })
      .execute();
  }

  async cronHourlyUpdateCancleLesson() {
    return await this.createQueryBuilder()
      .update()
      .set({ status: 'CLOSED' })
      .where('"startDate" = now()')
      .execute();
  }
}
