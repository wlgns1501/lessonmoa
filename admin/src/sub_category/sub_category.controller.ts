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
import { SubCategoryService } from './sub_category.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateSubCategoryPipe } from './dtos/createSubCategory.pipe';
import { CreateSubCategoryDto } from './dtos/createSubCategory.dto';
import { UpdateSubCategoryPipe } from './dtos/updateSubCategory.pipe';
import { UpdateSubCategoryDto } from './dtos/updateSubCategory.dto';

@ApiTags('subCategory')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly service: SubCategoryService) {}

  @Get('')
  @ApiOperation({ summary: '서브 카테고리 리스트' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  getSubCategories() {
    return this.service.getSubCategories();
  }

  @Post('')
  @ApiOperation({ summary: '서브 카테고리 생성' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  createSubCategory(
    @Body(new CreateSubCategoryPipe())
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.service.createSubCategory(createSubCategoryDto);
  }

  @Get(':subCategoryId')
  @ApiOperation({ summary: '서브 카테고리 상세페이지' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  getSubCategory(@Param('subCategoryId') subCategoryId: number) {
    return this.service.getSubCategory(subCategoryId);
  }

  @Patch(':subCategoryId')
  @ApiOperation({ summary: '서브 카테고리 수정' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  updateSubCategory(
    @Param('subCategoryId') subCategoryId: number,
    @Body(new UpdateSubCategoryPipe())
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.service.updateSubCategory(subCategoryId, updateSubCategoryDto);
  }

  @Delete(':subCategoryId')
  @ApiOperation({ summary: '서브 카테고리 삭제' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  deleteSubCategory(@Param('subCategoryId') subCategoryId: number) {
    return this.service.deleteSubCategory(subCategoryId);
  }
}
