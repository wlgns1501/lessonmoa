import { Location } from 'src/entities/location.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Location)
export class LocationRepository extends BaseRepository<Location> {
  async getLocations() {
    return await this.createQueryBuilder('l')
      .leftJoin('l.places', 'p')
      .select([
        'l.id as "id"',
        'l.name as "name"',
        'COUNT(p.id)::int as "placeCount"',
      ])
      .groupBy('l.id')
      .orderBy('l.name', 'ASC')
      .getRawMany();
  }

  async getLocation(locationId: number) {
    return await this.createQueryBuilder('location')
      .where({ id: locationId })
      .leftJoinAndSelect('location.places', 'places')
      .leftJoinAndSelect('places.lessons', 'lessons')
      .getOne();
  }
}
