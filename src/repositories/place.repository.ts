import { Location } from 'src/entities/location.entity';
import { Place } from 'src/entities/place.entity';
import { GetPlacesDto } from 'src/place/dtos/get_places.dto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Place)
export class PlaceRepository extends BaseRepository<Place> {
  async getPlacesByLocationId(
    locationId: number,
    getPlacesDto: GetPlacesDto,
    location: Location,
  ) {
    const { page, pageSize } = getPlacesDto;

    return await this.createQueryBuilder('p')
      .select()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .where({ location })
      .getMany();
  }

  async getPlaces(getPlacesDto: GetPlacesDto) {
    const { page, pageSize } = getPlacesDto;

    return await this.createQueryBuilder('p')
      .select()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getMany();
  }

  async getPlace(placeId: number) {
    return await this.createQueryBuilder('p')
      .select()
      .where({ id: placeId })
      .getOne();
  }
}
