import { License } from 'src/entities/lecense.entity';
import { User } from 'src/entities/user.entity';
import { GetLicensesDto } from 'src/license/dtos/getLicensesDto';
import { createLicenseDto } from 'src/license/dtos/createLicense.dto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { UpdateLicenseDto } from 'src/license/dtos/updateLicense.dto';

@EntityRepository(License)
export class LicenseRepository extends BaseRepository<License> {
  async getLicensesList(user: User, getLicensesDto: GetLicensesDto) {
    const { page, pageSize } = getLicensesDto;

    return await this.find({
      where: {
        user,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * 10,
      take: pageSize,
    });
  }

  async createLicense(user: User, createLicenseDto: createLicenseDto) {
    const { name, imageUrl } = createLicenseDto;

    this.create({
      name,
      imageUrl,
      user,
    }).save();
  }

  async getLicense(licenseId: number, user: User) {
    return this.findOne({ id: licenseId, user });
  }

  async updateLicense(
    licenseId: number,
    updateLicenseDto: UpdateLicenseDto,
    user: User,
  ) {
    const { name, imageUrl } = updateLicenseDto;
    return this.update({ id: licenseId, user }, { name, imageUrl });
  }

  async deleteLicense(licenseId: number, user: User) {
    return this.delete({ id: licenseId, user });
  }
}
