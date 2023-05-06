import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/repositories/category.repository';
import { Connection } from 'typeorm';

import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor(private readonly connection: Connection) {}

  async getCategories() {
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    const categories = await this.categoryRepository.getCategories();

    return categories;
  }

  async getCategory(categoryId: number) {
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    const category = await this.categoryRepository.getCategory(categoryId);

    if (!category) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '존재하지 않는 카테고리 입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }
}
