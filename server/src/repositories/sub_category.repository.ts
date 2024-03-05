import { SubCategory } from 'src/entities/sub_category.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(SubCategory)
export class SubCategoryRepository extends BaseRepository<SubCategory> {
  async getSubCategories() {
    return await this.createQueryBuilder('sub_category').getMany();
  }

  async getSubCategory(subCategoryId: number) {
    return await this.createQueryBuilder('sc')
      .leftJoinAndSelect('sc.lessons', 'lessons')
      .where({
        id: subCategoryId,
      })
      .getOne();
  }
}
