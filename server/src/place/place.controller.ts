import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { GetPlacesPipe } from './dtos/get_places.pipe';
import { GetPlacesDto } from './dtos/get_places.dto';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private service: PlaceService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '장소 리스트' })
  getPlaces(@Query(new GetPlacesPipe()) getPlacesDto: GetPlacesDto) {
    return this.service.getPlaces(getPlacesDto);
  }
}
