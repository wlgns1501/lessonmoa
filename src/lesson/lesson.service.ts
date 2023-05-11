import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { UserRepository } from 'src/repositories/user.repository';
import { Lesson } from 'src/entities/lesson.entity';

type APPLY_USER = {
  userId: number;
  lessonId: number;
  priority: number;
};

export const TYPE_LESSON_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
};

export const TYPE_UPDATE_PARTICIPANT = {
  PLUS: 'PLUS',
  MINUS: 'MINUS',
};

@Injectable()
export class LessonService {
  private applyQueue: Array<{
    userId: number;
    lessonId: number;
    priority: number;
  }> = [];
  private isQueueLocked = false;
  private lessonRepository: LessonRepository;
  private subCategoryRepository: SubCategoryRepository;
  private userLessonRepository: UserLessonRepository;
  private userRepository: UserRepository;
  constructor(private readonly connection: Connection) {}

  private calculateRetryAfter(): number {
    const now = Date.now();
    const nextUnlockTime = this.getNextUnlockTime();
    const retryAfter = Math.ceil((nextUnlockTime - now) / 1000);
    return retryAfter;
  }

  private getNextUnlockTime(): number {
    const now = Date.now();
    const nextUnlockTime = now + 5000;
    return nextUnlockTime;
  }

  private async checkUserLimit(lessonId: number) {
    const lesson = await this.getLesson(lessonId);

    if (lesson.participantCount === lesson.userLimit) {
      throw new HttpException(
        {
          message: HTTP_ERROR.BAD_REQUEST,
          detail: '해당 레슨은 수강 인원이 꽉 찼습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return lesson;
  }

  private async checkAlreadyApply(user: User, lesson: Lesson) {
    const checkAlreadyApply = await this.userLessonRepository.getUserId(
      user,
      lesson,
    );

    if (checkAlreadyApply) {
      throw new HttpException(
        {
          message: HTTP_ERROR.BAD_REQUEST,
          detail: '이미 수강한 상태 입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return checkAlreadyApply;
  }

  private async findFirstWaitingUser(lessonId: number) {
    const filteredUsers = await this.applyQueue.filter((el) => {
      if (el.lessonId === lessonId) return el;
    });

    return filteredUsers[0];
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
    this.userRepository = this.connection.getCustomRepository(UserRepository);

    // 대기열이 꽉차서 대기열 lock 된 경우
    if (this.isQueueLocked) {
      const retryAfter = this.calculateRetryAfter();
      throw new HttpException(
        {
          message: HTTP_ERROR.APPLY_QUEUE_IS_FULL,
          detail: `대기열이 꽉 찬 상태입니다. ${retryAfter}후에 다시 시도해 주세요`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 똑같은 유저가 똑같은 레슨에 여러번 수강하는 경우
    const alreadyInQueue = this.applyQueue.some(
      (item) => item.userId === user.id && item.lessonId === lessonId,
    );

    if (alreadyInQueue) {
      throw new HttpException(
        {
          message: HTTP_ERROR.ALREADY_IN_QUEUE,
          detail: '이미 대기열에 있습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const lesson = await this.checkUserLimit(lessonId);

    await this.checkAlreadyApply(user, lesson);

    if (this.applyQueue.length >= 100) this.isQueueLocked = true;

    let applyUser: APPLY_USER;

    const waitingLastUser = await this.findFirstWaitingUser(lessonId);

    console.log(waitingLastUser);

    /**
     * queue에 push 하는 조건
     * 1. 해당 레슨이 꽉차서
     * 2. 동시에 신청을 했을때
     * 3.
     */

    // if ()

    // if (this.applyQueue.length <= 100) {
    //   const { userId, lessonId } = applyUser;

    //   try {
    //     const user = await this.userRepository.findOne({ id: userId });

    //     await this.userLessonRepository.applyLesson(user, lesson);

    //     const { raw } = await this.lessonRepository.updateParticipantCount(
    //       lessonId,
    //       TYPE_UPDATE_PARTICIPANT.PLUS,
    //     );

    //     const [checkCount] = raw;

    //     if (checkCount.participantCount === 20) {
    //       await this.lessonRepository.updateStatusLesson(
    //         lessonId,
    //         TYPE_LESSON_STATUS.CLOSED,
    //       );
    //     }
    //     console.log(this.applyQueue);

    //     return { success: true };
    //   } catch (error) {
    //     // this.applyQueue.push({ userId, lessonId });

    //     throw new HttpException(
    //       {
    //         message: HTTP_ERROR.BAD_REQUEST,
    //         detail: '해당 레슨은 수강 인원이 꽉 찼습니다.',
    //       },
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // } else {
    //   // this.applyQueue.push({ userId: user.id, lessonId });

    //   if (this.applyQueue.length === 100) {
    //     this.isQueueLocked = true;
    //   }

    //   throw new HttpException(
    //     {
    //       message: HTTP_ERROR.BAD_REQUEST,
    //       detail: '대기열에 추가 되었습니다.',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
  }

  @Transactional()
  async withdrawalLesson(user: User, lessonId: number) {
    this.lessonRepository =
      this.connection.getCustomRepository(LessonRepository);
    this.userLessonRepository =
      this.connection.getCustomRepository(UserLessonRepository);

    const lesson = await this.getLesson(lessonId);

    const checkAlreadyApply = await this.userLessonRepository.getUserId(
      user,
      lesson,
    );

    if (!checkAlreadyApply) {
      throw new HttpException(
        {
          message: HTTP_ERROR.BAD_REQUEST,
          detail: '수강 신청한 내역에 없습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userLessonRepository.withdrawalLesson(user, lesson);

    await this.lessonRepository.updateParticipantCount(
      lessonId,
      TYPE_UPDATE_PARTICIPANT.MINUS,
    );

    await this.lessonRepository.updateStatusLesson(
      lessonId,
      TYPE_LESSON_STATUS.ACTIVE,
    );

    return { success: true };
  }
}
