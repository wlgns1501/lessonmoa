import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from 'src/entities/user.entity';

export class SignUpDto extends UserInfo {
  @ApiProperty({ description: 'locationId', example: 1 })
  locationId: number;
}
