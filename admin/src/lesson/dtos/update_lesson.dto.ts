import { ApiProperty } from '@nestjs/swagger';
import { LessonInfo } from 'src/entities/lesson.entity';

export class UpdateLessonDto extends LessonInfo {
  @ApiProperty({ description: '서브 카테고리 Id' })
  subCategoryId: number;

  @ApiProperty({ description: '장소 Id' })
  placeId: number;
}
