import { CreateCategoryDto } from 'src/category/dtos/createCategory.dto';
import { UpdateCategoryDto } from 'src/category/dtos/updateCategory.dto';
import { Category } from 'src/entities/category.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {
  async getCategories() {
    return await this.find();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    return await this.createQueryBuilder('category')
      .insert()
      .into('category')
      .values({ name })
      .returning('*')
      .execute();
  }

  async getCategory(categoryId: number) {
    return await this.createQueryBuilder('category')
      .where({ id: categoryId })
      .getOne();
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const { name } = updateCategoryDto;

    return await this.createQueryBuilder('category')
      .update({ name })
      .where({ id: categoryId })
      .returning('*')
      .execute();
  }

  async deleteCategory(categoryId: number) {
    return this.createQueryBuilder('category')
      .delete()
      .where({ id: categoryId })
      .execute();
  }
}
