import { Category } from 'src/entities/category.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {
  async getCategories() {
    return await this.find();
  }

  async getCategory(categoryId: number) {
    return await this.createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .where({ id: categoryId })
      .getOne();
  }
}
