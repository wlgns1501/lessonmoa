import { ApiProperty } from '@nestjs/swagger';

export class GetLicensesDto {
  @ApiProperty({ description: 'page', example: 1 })
  page: number;

  @ApiProperty({ description: 'pageSize', example: 10 })
  pageSize: number;
}
