import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Connection } from 'typeorm';
import { LicenseRepository } from 'src/repositories/license.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { GetLicensesDto } from './dtos/getLicensesDto';
import { HTTP_ERROR } from 'src/constants/http-error';
import { createLicenseDto } from './dtos/createLicense.dto';
import { UpdateLicenseDto } from './dtos/updateLicense.dto';

@Injectable()
export class LicenseService {
  private licenseRepository: LicenseRepository;
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
  async createLicense(user: User, createLicenseDto: createLicenseDto) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const license = await this.licenseRepository.createLicense(
      user,
      createLicenseDto,
    );
    return license;
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

    await this.licenseRepository.deleteLicense(licenseId, user);

    return { success: true };
  }
}
