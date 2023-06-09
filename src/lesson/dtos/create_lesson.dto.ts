import { ApiProperty } from '@nestjs/swagger';
import { LessonInfo } from 'src/entities/lesson.entity';

export class CreateLessonDto extends LessonInfo {
  @ApiProperty({ description: '서브 카테고리 Id', required: true })
  subCategoryId: number;

  @ApiProperty({ description: '장소 Id', required: true, example: 1 })
  placeId: number;
}
