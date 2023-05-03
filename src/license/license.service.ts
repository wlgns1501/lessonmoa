import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Connection } from 'typeorm';
import { LicenseDto } from './dtos/license.dto';
import { LicenseRepository } from 'src/repositories/license.repository';

@Injectable()
export class LicenseService {
  private licenseRepository: LicenseRepository;
  constructor(private readonly connection: Connection) {}

  async createLicense(user: User, licenseDto: LicenseDto) {
    this.licenseRepository =
      this.connection.getCustomRepository(LicenseRepository);

    const license = await this.licenseRepository.createLicense(
      user,
      licenseDto,
    );
    return license;
  }
}
