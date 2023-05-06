import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubCategory } from './sub_category.entity';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ name: 'name', comment: '카테고리 명 ' })
  @ApiProperty({ description: 'name', required: true, example: '축구' })
  name: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];
}
