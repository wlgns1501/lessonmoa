import { ApiProperty } from '@nestjs/swagger';
import { SubCategoryInfo } from 'src/entities/sub_category.entity';

export class UpdateSubCategoryDto extends SubCategoryInfo {
  @ApiProperty({ description: '카테고리 id', required: true })
  categoryId: number;
}
