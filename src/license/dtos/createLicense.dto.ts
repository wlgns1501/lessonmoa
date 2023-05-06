import { ApiProperty } from '@nestjs/swagger';
import { LicenseInfo } from 'src/entities/license.entity';

export class CreateLicenseDto extends LicenseInfo {
  @ApiProperty({ description: '카테고리 Id' })
  categoryId: number;
}
