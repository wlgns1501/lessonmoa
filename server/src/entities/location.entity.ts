import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Place } from './place.entity';
import { User } from './user.entity';

@Entity({ name: 'location' })
export class Location {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ name: 'name', comment: '이름' })
  @ApiProperty({ description: '지역 이름' })
  name: string;

  @OneToMany(() => Place, (place) => place.location)
  places: Place[];

  @OneToMany(() => User, (user) => user.location)
  users: User[];
}
