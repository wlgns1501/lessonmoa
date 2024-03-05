import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Location } from './location.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'place' })
@Unique(['name'])
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ name: 'name', comment: '장소 이름' })
  @ApiProperty({ description: 'name' })
  name: string;

  @Column({ name: 'address', comment: '주소' })
  @ApiProperty({ description: 'address' })
  address: string;

  @ManyToOne(() => Location, (location) => location.places)
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @OneToMany(() => Lesson, (lesson) => lesson.place)
  lessons: Lesson;
}

export class PlaceInfo extends PickType(Place, ['name', 'address']) {}
