import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import { License } from './license.entity';
import { Lesson } from './lesson.entity';
import { UserLesson } from './user_lesson.entity';

@Entity({ name: 'user' })
@Unique(['email'])
@Unique(['nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  @ApiProperty({ description: 'userId' })
  id: number;

  @Column({ name: 'email', comment: '이메일' })
  @ApiProperty({
    description: 'email',
    nullable: false,
    required: true,
    example: 'wlgns1501@gmail.com',
  })
  email: string;

  @Exclude()
  @Column({ name: 'password', comment: '비밀번호', nullable: true })
  @ApiProperty({
    description: '비밀번호',
    nullable: false,
    required: true,
    example: 'gkstlsyjh116!',
  })
  password: string;

  @Column({ name: 'nickname', comment: '닉네임', nullable: true })
  @ApiProperty({
    description: '닉네임',
    nullable: false,
    required: true,
    example: 'jihun',
  })
  nickname: string;

  @Column({ name: 'isInstructor', comment: '강사 여부', default: false })
  @ApiProperty({ description: '강사 여부', default: false })
  isInstructor: boolean;

  @Column({ name: 'isAdmin', comment: 'admin 여부', default: false })
  @ApiProperty({ description: 'admin 여부', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'createdAt', comment: '생성시간' })
  @ApiProperty({ description: '생성 시간' })
  createdAt: string;

  @OneToMany(() => License, (license) => license.user)
  licenses: License[];

  @OneToMany(() => Lesson, (lesson) => lesson.user)
  lessons: Lesson[];

  @OneToMany(() => UserLesson, (userLesson) => userLesson.user)
  userLessons: UserLesson[];

  @BeforeInsert()
  async hashedPassword() {
    this.password = await bcrypt.hash(this.password, 9);
  }

  async validatedPassword(password: string) {
    const hash = await bcrypt.compare(password, this.password);

    return hash;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

export class UserInfo extends PickType(User, [
  'email',
  'password',
  'nickname',
]) {}
