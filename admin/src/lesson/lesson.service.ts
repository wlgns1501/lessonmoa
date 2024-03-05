import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { GetLessonsDto } from './dtos/get_lessons.dto';
import { LessonRepository } from 'src/repositories/lesson.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SubCategoryRepository } from 'src/repositories/sub_category.repository';
import { HTTP_ERROR } from 'src/constants/http-error';
import { UpdateLessonDto } from './dtos/update_lesson.dto';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import { UserLessonRepository } from 'src/repositories/user_lesson.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { PlaceRepository } from 'src/repositories/place.repository';

export const TYPE_LESSON_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  CANCELED: 'CANCELED',
};

export const TYPE_UPDATE_PARTICIPANT = {
  PLUS: 'PLUS',
  MINUS: 'MINUS',
};

@Injectable()
export class LessonService {
  private lessonRepository: LessonRepository;
  private subCategoryRepository: SubCategoryRepository;
  private userLessonRepository: UserLessonRepository;
  private userRepository: UserRepository;
  private placeRepository: PlaceRepository;

  constructor(private readonly connection: Connection) {}

  // private async checkUserLimit(lessonId: number) {
  //   const lesson = await this.getLesson(lessonId);

  //   if (lesson.participantCount === lesson.userLimit) {
  //     throw new HttpException(
  //       {
  //         message: HTTP_ERROR.BAD_REQUEST,
  //         detail: '해당 레슨은 수강 인원이 꽉 찼습니다.',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return lesson;
  // }

  // private async checkAlreadyApply(user: User, lesson: Lesson) {
  //   const checkAlreadyApply = await this.userLessonRepository.getUserId(
  //     user,
  //     lesson,
  //   );

  //   if (checkAlreadyApply) {
  //     throw new HttpException(
  //       {
  //         message: HTTP_ERROR.BAD_REQUEST,
  //         detail: '이미 수강한 상태 입니다.',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return checkAlreadyApply;
  // }

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

  @Transactional()
  async updateLesson(lessonId: number, updateLessonDto: UpdateLessonDto) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );
    this.placeRepository = this.connection.getCustomRepository(PlaceRepository);

    const { subCategoryId, placeId } = updateLessonDto;

    const subCategory = await this.subCategoryRepository.getSubCategory(
      subCategoryId,
    );

    const place = await this.placeRepository.getPlace(placeId);

    try {
      const { raw, affected } = await this.lessonRepository.updateLesson(
        lessonId,
        updateLessonDto,
        subCategory,
        place,
      );

      if (affected === 0) {
        throw new HttpException(
          {
            message: HTTP_ERROR.NOT_FOUND,
            detail: '해당 레슨은 존재하지 않습니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const [lesson] = raw;

      return lesson;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 레슨 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  @Transactional()
  async updateLessonCanceled(lessonId: number) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);

    const { raw, affected } = await this.lessonRepository.updateStatusLesson(
      lessonId,
      TYPE_LESSON_STATUS.CANCELED,
    );

    if (affected === 0) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 레슨은 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const [lesson] = raw;

    return lesson;
  }
}
