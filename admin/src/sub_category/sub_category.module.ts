import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub_category.controller';
import { SubCategoryService } from './sub_category.service';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService]
})
export class SubCategoryModule {}
