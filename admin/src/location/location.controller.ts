import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { GetLocationsDto } from './dtos/get_locations.dto';
import { GetLocationsPipe } from './dtos/get_locations.pipe';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateLocationPipe } from './dtos/create_location.pipe';
import { CreateLocationDto } from './dtos/create_location.dto';
import { UpdateLocationPipe } from './dtos/update_location.pipe';
import { UpdateLocationDto } from './dtos/update_location.dto';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Get('')
  @ApiOperation({ summary: '지역 리스트' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  getLocations(
    @Query(new GetLocationsPipe()) getLocationsDto: GetLocationsDto,
  ) {
    return this.service.getLocations(getLocationsDto);
  }

  @Post('')
  @ApiOperation({ summary: '지역 생성' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  createLocation(
    @Body(new CreateLocationPipe()) createLocationDto: CreateLocationDto,
  ) {
    return this.service.createLocation(createLocationDto);
  }

  @Get(':locationId')
  @ApiOperation({ summary: '지역 상세페이지' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  getLocation(@Param('locationId') locationId: number) {
    return this.service.getLocation(locationId);
  }

  @Patch(':locationId')
  @ApiOperation({ summary: '지역 상세페이지' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  updateLocation(
    @Param('locationId') locationId: number,
    @Body(new UpdateLocationPipe()) updateLocationDto: UpdateLocationDto,
  ) {
    return this.service.updateLocation(locationId, updateLocationDto);
  }

  @Delete(':locationId')
  @ApiOperation({ summary: '지역 삭제' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  deleteLocation(@Param('locationId') locationId: number) {
    return this.service.deleteLocation(locationId);
  }
}
