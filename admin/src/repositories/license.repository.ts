import { License } from 'src/entities/license.entity';
import { User } from 'src/entities/user.entity';
import { GetLicensesDto } from 'src/license/dtos/getLicensesDto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(License)
export class LicenseRepository extends BaseRepository<License> {
  async getLicensesList(getLicensesDto: GetLicensesDto) {
    const { page, pageSize } = getLicensesDto;

    return await this.createQueryBuilder('license')
      .leftJoinAndSelect('license.user', 'user')
      .orderBy('license.createdAt', 'DESC')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getMany();
  }

  async getLicense(licenseId: number) {
    return await this.createQueryBuilder('license')
      .where({ id: licenseId })
      .leftJoinAndSelect('license.user', 'user')
      .getOne();
  }

  async changeStatusLicense(licenseId: number, status: string) {
    return await this.createQueryBuilder('license')
      .update({ status })
      .where({ id: licenseId })
      .returning('*')
      .execute();
  }

  async getActiveLicenses(userId: number) {
    return await this.createQueryBuilder('license')
      .leftJoinAndSelect('license.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere({ status: 'ACTIVE' })
      .getMany();
  }
}
