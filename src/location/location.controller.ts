import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { GetLocationsDto } from './dtos/get_locations.dto';
import { GetLocationsPipe } from './dtos/get_locations.pipe';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Get('')
  @ApiOperation({ summary: '지역 리스트' })
  @HttpCode(HttpStatus.OK)
  getLocations(
    @Query(new GetLocationsPipe()) getLocationsDto: GetLocationsDto,
  ) {
    return this.service.getLocations(getLocationsDto);
  }

  @Get(':locationId')
  @ApiOperation({ summary: '지역 상세페이지' })
  @HttpCode(HttpStatus.OK)
  getLocation(@Param('locationId') locationId: number) {
    return this.service.getLocation(locationId);
  }
}
