import { CreateLicenseDto } from 'src/license/dtos/createLicense.dto';
import { License } from 'src/entities/license.entity';
import { User } from 'src/entities/user.entity';
import { GetLicensesDto } from 'src/license/dtos/getLicensesDto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { UpdateLicenseDto } from 'src/license/dtos/updateLicense.dto';
import { Category } from 'src/entities/category.entity';

@EntityRepository(License)
export class LicenseRepository extends BaseRepository<License> {
  async getLicensesList(user: User, getLicensesDto: GetLicensesDto) {
    const { page, pageSize } = getLicensesDto;

    return await this.createQueryBuilder('license')
      .leftJoinAndSelect('license.category', 'category')
      .orderBy('license.createdAt', 'DESC')
      .getMany();
  }

  async createLicense(
    user: User,
    createLicenseDto: CreateLicenseDto,
    category: Category,
  ) {
    const { name, imageUrl } = createLicenseDto;

    return await this.createQueryBuilder()
      .insert()
      .into(License)
      .values({ user, name, imageUrl, category })
      .returning('*')
      .execute();
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

  async getActiveLicenses(user: User) {
    return this.find({ user, status: 'ACTIVE' });
  }
}
