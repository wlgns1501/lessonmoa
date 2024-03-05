import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PlaceRepository } from 'src/repositories/place.repository';
import { Connection } from 'typeorm';
import { GetPlacesDto } from './dtos/get_places.dto';
import { LocationRepository } from 'src/repositories/location.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreatePlaceDto } from './dtos/create_location.dto';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import { UpdatePlaceDto } from './dtos/update_place.dto';
import { HTTP_ERROR } from 'src/constants/http-error';

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
        getPlacesDto,
        location,
      );
    } else {
      places = await this.placeRepository.getPlaces(getPlacesDto);
    }

    return places;
  }

  @Transactional()
  async createPlace(createPlaceDto: CreatePlaceDto) {
    this.placeRepository = this.connection.getCustomRepository(PlaceRepository);
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);
    const { locationId } = createPlaceDto;

    const location = await this.locationRepository.getLocation(locationId);
    try {
      const { raw } = await this.placeRepository.createPlace(
        createPlaceDto,
        location,
      );
      const [place] = raw;
      return place;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 장소 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  async getPlace(placeId: number) {
    this.placeRepository = this.connection.getCustomRepository(PlaceRepository);

    const place = await this.placeRepository.getPlace(placeId);

    if (!place) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 장소는 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return place;
  }

  @Transactional()
  async updatePlace(placeId: number, updatePlaceDto: UpdatePlaceDto) {
    this.placeRepository = this.connection.getCustomRepository(PlaceRepository);
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);

    const { locationId } = updatePlaceDto;

    const location = await this.locationRepository.getLocation(locationId);

    try {
      const { raw, affected } = await this.placeRepository.updatePlace(
        placeId,
        updatePlaceDto,
        location,
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

      const [place] = raw;

      return place;
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('name')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 장소 명 입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }
    }
  }

  @Transactional()
  async deletePlace(placeId: number) {
    this.placeRepository = this.connection.getCustomRepository(PlaceRepository);

    await this.placeRepository.deletePlace(placeId);

    return { success: true };
  }
}
