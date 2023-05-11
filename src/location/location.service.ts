import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HTTP_ERROR } from 'src/constants/http-error';
import { LocationRepository } from 'src/repositories/location.repository';
import { Connection } from 'typeorm';

@Injectable()
export class LocationService {
  private locationRepository: LocationRepository;
  constructor(private connection: Connection) {}

  async getLocations() {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    const locations = this.locationRepository.getLocations();

    return locations;
  }

  async getLocation(locationId: number) {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    const location = await this.locationRepository.getLocation(locationId);

    if (!location) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 지역은 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return location;
  }
}
