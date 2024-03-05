import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateCategoryPipe } from './dtos/createCategory.pipe';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { UpdateCategoryPipe } from './dtos/updateCategory.pipe';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 리스트' })
  @UseGuards(AdminGuard)
  getCategories() {
    return this.service.getCategories();
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 생성' })
  @UseGuards(AdminGuard)
  createCategory(
    @Body(new CreateCategoryPipe()) createCategoryDto: CreateCategoryDto,
  ) {
    return this.service.createCategory(createCategoryDto);
  }

  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 상세페이지' })
  @UseGuards(AdminGuard)
  getCategory(@Param('categoryId') categoryId: number) {
    return this.service.getCategory(categoryId);
  }

  @Patch(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 수정' })
  @UseGuards(AdminGuard)
  updateCategory(
    @Param('categoryId') categoryId: number,
    @Body(new UpdateCategoryPipe()) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.service.updateCategory(categoryId, updateCategoryDto);
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: '카테고리 삭제' })
  @UseGuards(AdminGuard)
  deleteCategory(@Param('categoryId') categoryId: number) {
    return this.service.deleteCategory(categoryId);
  }
}
