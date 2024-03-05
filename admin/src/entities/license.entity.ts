import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity({ name: 'license' })
@Unique(['imageUrl', 'category'])
export class License extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ name: 'name', comment: '자격증 이름' })
  @ApiProperty({
    description: 'name',
    required: true,
    example: '축구 지도사 자격증',
  })
  name: string;

  @Column({ name: 'imageUrl', comment: '자격증 이미지' })
  @ApiProperty({ description: '자격증 이미지', required: true })
  imageUrl: string;

  @Column({ name: 'status', comment: '인증 상태', default: 'PENDING' })
  @ApiProperty({ description: '인증 상태', default: 'PENDING' })
  status: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: string;

  @ManyToOne(() => User, (user) => user.licenses)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}

export class LicenseInfo extends PickType(License, ['imageUrl', 'name']) {}
