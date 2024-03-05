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
import { PlaceService } from './place.service';
import { GetPlacesPipe } from './dtos/get_places.pipe';
import { GetPlacesDto } from './dtos/get_places.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreatePlacePipe } from './dtos/create_place.pipe';
import { CreatePlaceDto } from './dtos/create_location.dto';
import { UpdatePlacePipe } from './dtos/update_place.pipe';
import { UpdatePlaceDto } from './dtos/update_place.dto';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private service: PlaceService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '장소 리스트' })
  @UseGuards(AdminGuard)
  getPlaces(@Query(new GetPlacesPipe()) getPlacesDto: GetPlacesDto) {
    return this.service.getPlaces(getPlacesDto);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '장소 생성' })
  @UseGuards(AdminGuard)
  createPlace(@Body(new CreatePlacePipe()) createPlaceDto: CreatePlaceDto) {
    return this.service.createPlace(createPlaceDto);
  }

  @Get(':placeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '장소 상세 페이지' })
  @UseGuards(AdminGuard)
  getPlace(@Param('placeId') placeId: number) {
    return this.service.getPlace(placeId);
  }

  @Patch(':placeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '장소 상세 페이지' })
  @UseGuards(AdminGuard)
  updatePlace(
    @Param('placeId') placeId: number,
    @Body(new UpdatePlacePipe()) updatePlaceDto: UpdatePlaceDto,
  ) {
    return this.service.updatePlace(placeId, updatePlaceDto);
  }

  @Delete(':placeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '장소 상세 페이지' })
  @UseGuards(AdminGuard)
  deletePlace(@Param('placeId') placeId: number) {
    return this.service.deletePlace(placeId);
  }
}
