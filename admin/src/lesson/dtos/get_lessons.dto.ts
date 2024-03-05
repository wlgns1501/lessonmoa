import { ApiProperty } from '@nestjs/swagger';

export class GetLessonsDto {
  @ApiProperty({ description: 'page', example: 1, required: true })
  page: number;

  @ApiProperty({ description: 'pageSize', example: 10, required: true })
  pageSize: number;

  @ApiProperty({ description: 'subCategoryId', required: false, example: 1 })
  subCategoryId: number;
}
