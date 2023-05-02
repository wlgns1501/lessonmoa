import { SignUpDto } from 'src/auth/dtos/signup.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(User)
export class AuthRepository extends BaseRepository<User> {
  async signUp(signUpDto: SignUpDto) {
    return this.create({ ...signUpDto }).save();
  }
}
