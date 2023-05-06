import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 리스트' })
  getCategories() {
    return this.service.getCategories();
  }

  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 상세페이지' })
  getCategory(@Param('categoryId') categoryId: number) {
    return this.service.getCategory(categoryId);
  }
}
