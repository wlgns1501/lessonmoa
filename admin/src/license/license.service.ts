import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LicenseRepository } from 'src/repositories/license.repository';
import { Connection } from 'typeorm';
import { GetLicensesDto } from './dtos/getLicensesDto';
import { HTTP_ERROR } from 'src/constants/http-error';
import { UserRepository } from 'src/repositories/user.repository';

export const LICENSE_STATUS_TYPE = {
  ACTIVE: 'ACTIVE',
  REFUSED: 'REFUSED',
};

@Injectable()
export class LicenseService {
  private licenseRepository: LicenseRepository;
  private userRepository: UserRepository;

  constructor(private readonly connection: Connection) {}

  async getLicenseList(getLicensesDto: GetLicensesDto) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const licenses = await this.licenseRepository.getLicensesList(
      getLicensesDto,
    );

    return licenses;
  }

  async getLicense(licenseId: number) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const license = await this.licenseRepository.getLicense(licenseId);

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

  async changeActiveLicense(licenseId: number) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);
    this.userRepository = this.connection.getCustomRepository(UserRepository);

    const { generatedMaps, raw, affected } =
      await this.licenseRepository.changeStatusLicense(
        licenseId,
        LICENSE_STATUS_TYPE.ACTIVE,
      );

    if (affected === 0) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 라이센스는 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const [{ userId }] = raw;

    await this.userRepository.changeIsInstructorUser(userId, true);

    return { success: true };
  }

  async changeRefusedLicense(licenseId: number) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);
    this.userRepository = this.connection.getCustomRepository(UserRepository);

    const { generatedMaps, raw, affected } =
      await this.licenseRepository.changeStatusLicense(
        licenseId,
        LICENSE_STATUS_TYPE.REFUSED,
      );

    if (affected === 0) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 라이센스는 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const [{ userId }] = raw;

    const ActiveLicenses = await this.licenseRepository.getActiveLicenses(
      userId,
    );

    if (ActiveLicenses.length === 0) {
      await this.userRepository.changeIsInstructorUser(userId, false);
    }

    return { success: true };
  }
}
