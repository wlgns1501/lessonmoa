import { Injectable } from '@nestjs/common';
import { PlaceRepository } from 'src/repositories/place.repository';
import { Connection } from 'typeorm';
import { GetPlacesDto } from './dtos/get_places.dto';
import { LocationRepository } from 'src/repositories/location.repository';

@Injectable()
export class PlaceService {
  private placeRepository: PlaceRepository;
  private locationRepository: LocationRepository;
  constructor(private readonly connection: Connection) {}

  async getPlaces(getPlacesDto: GetPlacesDto) {
    this.placeRepository = this.connection.getCustomRepository(PlaceRepository);
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);
    const { locationId } = getPlacesDto;
    let places;

    if (locationId) {
      const location = await this.locationRepository.getLocation(locationId);
      places = await this.placeRepository.getPlacesByLocationId(
        locationId,
        getPlacesDto,
        location,
      );
    } else {
      places = await this.placeRepository.getPlaces(getPlacesDto);
    }

    return places;
  }
}
