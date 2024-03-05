import { Location } from 'src/entities/location.entity';
import { CreateLocationDto } from 'src/location/dtos/create_location.dto';
import { GetLocationsDto } from 'src/location/dtos/get_locations.dto';
import { UpdateLocationDto } from 'src/location/dtos/update_location.dto';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Location)
export class LocationRepository extends BaseRepository<Location> {
  async getLocations(getLocationsDto: GetLocationsDto) {
    const { page, pageSize } = getLocationsDto;

    return await this.createQueryBuilder('l')
      .leftJoin('l.places', 'p')
      .select([
        'l.id as "id"',
        'l.name as "name"',
        'COUNT(p.id)::int as "placeCount"',
      ])
      .groupBy('l.id')
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('l.name', 'ASC')
      .getRawMany();
  }

  async createLocation(createLocationDto: CreateLocationDto) {
    const { name } = createLocationDto;

    return await this.createQueryBuilder()
      .insert()
      .into(Location)
      .values({ name })
      .returning('*')
      .execute();
  }

  async getLocation(locationId: number) {
    return await this.createQueryBuilder('location')
      .where({ id: locationId })
      .leftJoinAndSelect('location.places', 'places')
      .leftJoinAndSelect('places.lessons', 'lessons')
      .getOne();
  }

  async updateLocation(
    locationId: number,
    updateLocationDto: UpdateLocationDto,
  ) {
    const { name } = updateLocationDto;

    return await this.createQueryBuilder()
      .update()
      .set({ name })
      .where({ id: locationId })
      .returning('*')
      .execute();
  }

  async deleteLocation(locationId: number) {
    return await this.createQueryBuilder()
      .delete()
      .where({ id: locationId })
      .execute();
  }
}
