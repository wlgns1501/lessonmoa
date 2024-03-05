import { ApiProperty } from '@nestjs/swagger';
import { PlaceInfo } from 'src/entities/place.entity';

export class UpdatePlaceDto extends PlaceInfo {
  @ApiProperty({ description: '지역 Id', required: true, example: 1 })
  locationId: number;
}
