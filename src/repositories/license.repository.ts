import { License } from 'src/entities/lecense.entity';
import { User } from 'src/entities/user.entity';
import { LicenseDto } from 'src/license/dtos/license.dto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(License)
export class LicenseRepository extends BaseRepository<License> {
  async createLicense(user: User, licenseDto: LicenseDto) {
    const { name, imageUrl } = licenseDto;
    try {
      this.create({
        name,
        imageUrl,
        user,
      }).save();
    } catch (error) {
      console.log(error);
    }
  }
}
