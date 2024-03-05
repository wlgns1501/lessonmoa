import { ApiProperty } from '@nestjs/swagger';

export class GetPlacesDto {
  @ApiProperty({ description: '지역 Id', required: false })
  locationId: number;

  @ApiProperty({ description: 'page', example: 1 })
  page: number;

  @ApiProperty({ description: 'pageSize', example: 10 })
  pageSize: number;
}
