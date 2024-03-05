import { Lesson } from 'src/entities/lesson.entity';
import { Place } from 'src/entities/place.entity';
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
    place: Place,
  ) {
    const { name, content, userLimit, level, startDate, endDate } =
      updateLessonDto;

    return await this.createQueryBuilder()
      .update(Lesson)
      .set({
        name,
        content,
        userLimit,
        level,
        startDate,
        endDate,
        subCategory,
        place,
      })
      .where({ id: lessonId })
      .returning('*')
      .execute();
  }

  async updateStatusLesson(lessonId: number, status: string) {
    return await this.createQueryBuilder('l')
      .update()
      .set({ status })
      .where({ id: lessonId })
      .execute();
  }
}
