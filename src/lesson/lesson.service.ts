import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { GetLessonsDto } from './dtos/get_lessons.dto';
import { LessonRepository } from 'src/repositories/lesson.repository';
import { CreateLessonDto } from './dtos/create_lesson.dto';
import { User } from 'src/entities/user.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SubCategoryRepository } from 'src/repositories/sub_category.repository';
import { HTTP_ERROR } from 'src/constants/http-error';
import { UpdateLessonDto } from './dtos/update_lesson.dto';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import { UserLessonRepository } from 'src/repositories/user_lesson.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LessonService {
  private applyQueue: number[] = [];
  private isQueueLocked = false;
  private lessonRepository: LessonRepository;
  private subCategoryRepository: SubCategoryRepository;
  private userLessonRepository: UserLessonRepository;
  constructor(private readonly connection: Connection) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  unlockQueue() {
    this.isQueueLocked = false;
  }

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

  @Transactional()
  async updateLesson(lessonId: number, updateLessonDto: UpdateLessonDto) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );

    const { subCategoryId } = updateLessonDto;

    const subCategory = await this.subCategoryRepository.getSubCategory(
      subCategoryId,
    );

    try {
      const { raw, affected } = await this.lessonRepository.updateLesson(
        lessonId,
        updateLessonDto,
        subCategory,
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
  async applyLesson(user: User, lessonId: number) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);
    this.userLessonRepository =
      this.connection.getCustomRepository(UserLessonRepository);

    if (this.isQueueLocked) {
      return {
        message: '대기열이 꽉 찬 상태입니다. 잠시후에 다시 시도해 주세요',
      };
    }
    this.isQueueLocked = true;

    if (this.applyQueue.length >= 10) this.applyQueue.shift();

    this.applyQueue.push(user.id);

    const lesson = await this.getLesson(lessonId);
    console.log(this.applyQueue);

    if (lesson.participantCount === lesson.userLimit) {
      throw new HttpException(
        {
          message: HTTP_ERROR.BAD_REQUEST,
          detail: '해당 레슨은 수강 인원이 꽉 찼습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkAlreadyApply = await this.userLessonRepository.getUserId(user);

    if (checkAlreadyApply) {
      throw new HttpException(
        {
          message: HTTP_ERROR.BAD_REQUEST,
          detail: '이미 수강한 상태 입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userLessonRepository.applyLesson(user, lesson);

    const { raw } = await this.lessonRepository.updateParticipantCount(
      lessonId,
    );

    const [checkCount] = raw;

    if (checkCount.participantCount === 20) {
      await this.lessonRepository.updateStatusLesson(lessonId);
    }

    return { success: true };
  }
}
