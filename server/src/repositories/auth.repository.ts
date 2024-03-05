import { SignUpDto } from 'src/auth/dtos/signup.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Location } from 'src/entities/location.entity';

@EntityRepository(User)
export class AuthRepository extends BaseRepository<User> {
  async signUp(signUpDto: SignUpDto, location: Location) {
    const { nickname, email, password } = signUpDto;

    // return await this.create({ email, password, nickname }).save();

    return await this.createQueryBuilder()
      .insert()
      .into(User)
      .values({ nickname, email, password, location })
      .returning(['id', 'email', 'nickname'])
      .execute();
  }

  async findUserByEmail(email: string) {
    return await this.createQueryBuilder()
      .select([
        'id',
        'email',
        'password',
        'nickname',
        'isAdmin',
        'isInstructor',
      ])
      .where({ email })
      .getOne();
  }

  async signOut(userId: number) {
    return await this.delete({
      id: userId,
    });
  }
}
