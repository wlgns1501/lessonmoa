import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubCategoryRepository } from 'src/repositories/sub_category.repository';
import { Connection } from 'typeorm';
import { CreateSubCategoryDto } from './dtos/createSubCategory.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UpdateSubCategoryDto } from './dtos/updateSubCategory.dto';
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

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto) {
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    const { name, categoryId } = createSubCategoryDto;

    const category = await this.categoryRepository.getCategory(categoryId);

    try {
      const { raw } = await this.subCategoryRepository.createSubCategory(
        name,
        category,
      );
      const [subCategory] = raw;
      return subCategory;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 서브 카테고리 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
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

  @Transactional()
  async updateSubCategory(
    subCategoryId: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );
    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    const { name, categoryId } = updateSubCategoryDto;
    const category = await this.categoryRepository.getCategory(categoryId);
    try {
      const { raw, affected } =
        await this.subCategoryRepository.updateSubCategory(
          subCategoryId,
          name,
          category,
        );

      if (affected === 0) {
        throw new HttpException(
          {
            message: HTTP_ERROR.NOT_FOUND,
            detail: '해당 서브 카테고리는 존재하지 않습니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const [subCategory] = raw;

      return subCategory;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 서브 카테고리 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  @Transactional()
  async deleteSubCategory(subCategoryId: number) {
    this.subCategoryRepository = this.connection.getCustomRepository(
      SubCategoryRepository,
    );

    await this.subCategoryRepository.deleteSubCategory(subCategoryId);

    return { success: true };
  }
}
