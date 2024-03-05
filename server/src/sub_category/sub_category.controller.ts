import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubCategoryService } from './sub_category.service';

@ApiTags('subCategory')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly service: SubCategoryService) {}

  @Get('')
  @ApiOperation({ summary: '서브 카테고리 리스트' })
  @HttpCode(HttpStatus.OK)
  getSubCategories() {
    return this.service.getSubCategories();
  }

  @Get(':subCategoryId')
  @ApiOperation({ summary: '서브 카테고리 상세페이지' })
  @HttpCode(HttpStatus.OK)
  getSubCategory(@Param('subCategoryId') subCategoryId: number) {
    return this.service.getSubCategory(subCategoryId);
  }
}
