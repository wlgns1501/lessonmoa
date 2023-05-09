import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SubCategory } from './sub_category.entity';
import { UserLesson } from './user_lesson.entity';

@Entity({ name: 'lesson' })
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ name: 'name', comment: '레슨 명' })
  @ApiProperty({
    description: '레슨 명',
    required: true,
    example: '드리블 꿀팁 강의',
  })
  name: string;

  @Column({ name: 'content', comment: '수업 내용' })
  @ApiProperty({
    description: '수업 내용',
    required: true,
    example: '수업 내용 입니다.',
  })
  content: string;

  @Column({ name: 'userLimit', comment: '수업 최대 인원' })
  @ApiProperty({ description: '수업 최대 인원', required: true, example: 20 })
  userLimit: number;

  @Column({ name: 'level', comment: '레슨 레벨', nullable: true })
  @ApiProperty({
    description: '레슨 레벨',
    required: true,
    example: '초보',
  })
  level: string;

  @Column({ name: 'status', comment: '레슨 상태', default: 'RELEASE' })
  @ApiProperty({ description: '레슨 상태', readOnly: true })
  status: string;

  @Column({ name: 'participantCount', comment: '참가자 수', default: 0 })
  @ApiProperty({ description: '참가자 수', default: 0 })
  participantCount: number;

  @Column({ name: 'startDate', comment: '수업 시작 시간' })
  @ApiProperty({
    description: '수업 시작 시간',
    required: true,
    example: '2023-05-06 15:52:54.150',
  })
  startDate: string;

  @Column({ name: 'endDate', comment: '수업 종료 시간' })
  @ApiProperty({
    description: '수업 종료 시간',
    required: true,
    example: '2023-05-06 15:52:54.150',
  })
  endDate: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: string;

  @ManyToOne(() => User, (user) => user.lessons)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.lessons)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;

  @OneToMany(() => UserLesson, (userLesson) => userLesson.lesson)
  userLessons: UserLesson[];
}

export class LessonInfo extends PickType(Lesson, [
  'name',
  'content',
  'userLimit',
  'level',
  'startDate',
  'endDate',
]) {}
