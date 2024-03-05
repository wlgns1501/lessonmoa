import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/repositories/category.repository';
import { Connection } from 'typeorm';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import { HTTP_ERROR } from 'src/constants/http-error';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';

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

  @Transactional()
  async createCategory(createCategoryDto: CreateCategoryDto) {
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    try {
      const { raw } = await this.categoryRepository.createCategory(
        createCategoryDto,
      );
      const [category] = raw;
      return category;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 카테고리 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
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

  @Transactional()
  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    try {
      const { raw, affected } = await this.categoryRepository.updateCategory(
        categoryId,
        updateCategoryDto,
      );

      if (affected === 0) {
        throw new HttpException(
          {
            message: HTTP_ERROR.NOT_FOUND,
            detail: '해당 카테고리는 존재하지 않습니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const [category] = raw;

      return category;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 카테고리 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  @Transactional()
  async deleteCategory(categoryId: number) {
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    await this.categoryRepository.deleteCategory(categoryId);

    return { success: true };
  }
}
