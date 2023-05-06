import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Connection } from 'typeorm';
import { LicenseRepository } from 'src/repositories/license.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { GetLicensesDto } from './dtos/getLicensesDto';
import { HTTP_ERROR } from 'src/constants/http-error';
import { CreateLicenseDto } from './dtos/createLicense.dto';
import { UpdateLicenseDto } from './dtos/updateLicense.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';

@Injectable()
export class LicenseService {
  private licenseRepository: LicenseRepository;
  private userRepository: UserRepository;
  private categoryRepository: CategoryRepository;
  constructor(private readonly connection: Connection) {}

  async getLicensesList(user: User, getLicensesDto: GetLicensesDto) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const licenses = await this.licenseRepository.getLicensesList(
      user,
      getLicensesDto,
    );

    return licenses;
  }

  @Transactional()
  async createLicense(user: User, createLicenseDto: CreateLicenseDto) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    this.categoryRepository =
      this.connection.getCustomRepository(CategoryRepository);

    const { categoryId } = createLicenseDto;
    const category = await this.categoryRepository.getCategory(categoryId);

    try {
      const { raw } = await this.licenseRepository.createLicense(
        user,
        createLicenseDto,
        category,
      );

      const [license] = raw;
      return license;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 이름입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  async getLicense(licenseId: number, user: User) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const license = await this.licenseRepository.getLicense(licenseId, user);

    if (!license) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 라이센스는 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return license;
  }

  @Transactional()
  async updateLicense(
    licenseId: number,
    updateLicenseDto: UpdateLicenseDto,
    user: User,
  ) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const license = await this.licenseRepository.updateLicense(
      licenseId,
      updateLicenseDto,
      user,
    );

    return license;
  }

  @Transactional()
  async deleteLicense(licenseId: number, user: User) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);
    this.userRepository = this.connection.getCustomRepository(UserRepository);

    await this.licenseRepository.deleteLicense(licenseId, user);

    const licenses = await this.licenseRepository.getActiveLicenses(user);

    if (licenses.length === 0) {
      const userId = user.id;
      await this.userRepository.updateUserIsInstructor(userId);
    }

    return { success: true };
  }
}
