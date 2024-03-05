import { Location } from 'src/entities/location.entity';
import { GetLocationsDto } from 'src/location/dtos/get_locations.dto';
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

  async getLocation(locationId: number) {
    return await this.createQueryBuilder('location')
      .where({ id: locationId })
      .leftJoinAndSelect('location.places', 'places')
      .leftJoinAndSelect('places.lessons', 'lessons')
      .leftJoinAndSelect('lessons.user', 'user')
      .getOne();
  }

  async getLocationById(locationId: number) {
    return await this.findOne({ id: locationId });
  }
}
