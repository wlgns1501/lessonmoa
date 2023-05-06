import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { GetLessonsDto } from './dtos/get_lessons.dto';
import { LessonRepository } from 'src/repositories/lesson.repository';
import { CreateLessonDto } from './dtos/create_lesson.dto';
import { User } from 'src/entities/user.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SubCategoryRepository } from 'src/repositories/sub_category.repository';
import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class LessonService {
  private lessonRepository: LessonRepository;
  private subCategoryRepository: SubCategoryRepository;
  constructor(private readonly connection: Connection) {}

  async getLessonsList(getLessonsDto: GetLessonsDto) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);
    const { subCategoryId } = getLessonsDto;

    let lessons;

    if (!subCategoryId) {
      lessons = await this.lessonRepository.getLessons(getLessonsDto);
    } else {
      lessons = await this.lessonRepository.getLessonsBySubCategoryId(
        getLessonsDto,
      );
    }

    return lessons;
  }

  @Transactional()
  async createLesson(user: User, createLessonDto: CreateLessonDto) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );

    if (!user.isInstructor) {
      throw new HttpException(
        {
          message: HTTP_ERROR.DO_NOT_HAVE_PERMISSION,
          detail: '해당 권한이 없습니다. 라이센스를 등록 해주세요.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { subCategoryId } = createLessonDto;

    const subCategory = await this.subCategoryRepository.getSubCategory(
      subCategoryId,
    );

    const { raw } = await this.lessonRepository.createLesson(
      user,
      createLessonDto,
      subCategory,
    );

    const [lesson] = raw;

    return lesson;
  }

  async getLesson(lessonId: number) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);

    const lesson = await this.lessonRepository.getLesson(lessonId);

    if (!lesson) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 레슨은 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return lesson;
  }
}
