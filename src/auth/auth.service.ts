import { Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/repositories/auth.repository';
import { Connection, Transaction } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { catchError } from 'rxjs';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class AuthService {
  private authRepository: AuthRepository;
  constructor(private readonly connection: Connection) {}

  @Transactional()
  async signUp(signUpDto: SignUpDto) {
    try {
      this.authRepository = this.connection.getCustomRepository(AuthRepository);
      await this.authRepository.signUp(signUpDto);

      return { success: true };
    } catch (error) {
      console.log(error);

      console.error();
    }
  }
}
