import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Get('')
  @ApiOperation({ summary: '지역 리스트' })
  @HttpCode(HttpStatus.OK)
  getLocations() {
    return this.service.getLocations();
  }

  @Get(':locationId')
  @ApiOperation({ summary: '지역 상세페이지' })
  @HttpCode(HttpStatus.OK)
  getLocation(@Param('locationId') locationId: number) {
    return this.service.getLocation(locationId);
  }
}
