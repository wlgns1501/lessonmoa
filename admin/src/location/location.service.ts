import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HTTP_ERROR } from 'src/constants/http-error';
import { LocationRepository } from 'src/repositories/location.repository';
import { Connection, Transaction } from 'typeorm';
import { GetLocationsDto } from './dtos/get_locations.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateLocationDto } from './dtos/create_location.dto';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import { UpdateLocationDto } from './dtos/update_location.dto';

@Injectable()
export class LocationService {
  private locationRepository: LocationRepository;
  constructor(private connection: Connection) {}

  async getLocations(getLocationsDto: GetLocationsDto) {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    const locations = this.locationRepository.getLocations(getLocationsDto);

    return locations;
  }

  @Transactional()
  async createLocation(createLocationDto: CreateLocationDto) {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    try {
      const { raw } = await this.locationRepository.createLocation(
        createLocationDto,
      );

      const [location] = raw;
      return location;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 지역명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
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

  @Transactional()
  async updateLocation(
    locationId: number,
    updateLocationDto: UpdateLocationDto,
  ) {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    try {
      const { raw, affected } = await this.locationRepository.updateLocation(
        locationId,
        updateLocationDto,
      );

      if (affected === 0) {
        throw new HttpException(
          {
            message: HTTP_ERROR.NOT_FOUND,
            detail: '해당 지역은 존재하지 않습니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const [location] = raw;

      return location;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 지역명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  @Transactional()
  async deleteLocation(locationId: number) {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    await this.locationRepository.deleteLocation(locationId);

    return { success: true };
  }
}
