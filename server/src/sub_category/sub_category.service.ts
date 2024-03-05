import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubCategoryRepository } from 'src/repositories/sub_category.repository';
import { Connection } from 'typeorm';

import { Transactional } from 'typeorm-transactional-cls-hooked';

import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import { HTTP_ERROR } from 'src/constants/http-error';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class SubCategoryService {
  private subCategoryRepository: SubCategoryRepository;
  private categoryRepository: CategoryRepository;
  constructor(private readonly connection: Connection) {}

  async getSubCategories() {
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );

    const subCategories = await this.subCategoryRepository.getSubCategories();

    return subCategories;
  }

  async getSubCategory(subCategoryId: number) {
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );

    const subCategory = await this.subCategoryRepository.getSubCategory(
      subCategoryId,
    );

    return subCategory;
  }
}
