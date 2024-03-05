import { Location } from 'src/entities/location.entity';
import { Place } from 'src/entities/place.entity';
import { CreatePlaceDto } from 'src/place/dtos/create_location.dto';
import { GetPlacesDto } from 'src/place/dtos/get_places.dto';
import { UpdatePlaceDto } from 'src/place/dtos/update_place.dto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Place)
export class PlaceRepository extends BaseRepository<Place> {
  async getPlacesByLocationId(getPlacesDto: GetPlacesDto, location: Location) {
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

  async createPlace(createPlaceDto: CreatePlaceDto, location: Location) {
    const { name, address } = createPlaceDto;

    return await this.createQueryBuilder()
      .insert()
      .into(Place)
      .values({ name, address, location })
      .returning('*')
      .execute();
  }

  async updatePlace(
    placeId: number,
    updatePlaceDto: UpdatePlaceDto,
    location: Location,
  ) {
    const { name, address } = updatePlaceDto;

    return await this.createQueryBuilder()
      .update()
      .set({ name, address, location })
      .where({ id: placeId })
      .returning('*')
      .execute();
  }

  async deletePlace(placeId: number) {
    return await this.createQueryBuilder()
      .delete()
      .where({ id: placeId })
      .execute();
  }
}
