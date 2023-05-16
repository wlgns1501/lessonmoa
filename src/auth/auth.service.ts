import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/repositories/auth.repository';
import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SignInDto } from './dtos/signin.dto';
import { HTTP_ERROR } from 'src/constants/http-error';
import { POSTGRES_ERROR_CODE } from 'src/constants/postgres-error';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { LocationRepository } from 'src/repositories/location.repository';

@Injectable()
export class AuthService {
  private authRepository: AuthRepository;
  private locationRepository: LocationRepository;
  constructor(private readonly connection: Connection) {}

  private getAccessToken(user: User) {
    return jwt.sign(
      { email: user.email, isInstructor: user.isInstructor },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '8h' },
    );
  }

  private getRefreshToken(user: User) {
    return jwt.sign(
      { email: user.email, isInstructor: user.isInstructor },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2d' },
    );
  }

  @Transactional()
  async signUp(signUpDto: SignUpDto) {
    try {
      this.authRepository = this.connection.getCustomRepository(AuthRepository);
      this.locationRepository =
        this.connection.getCustomRepository(LocationRepository);

      const { locationId } = signUpDto;
      const location = await this.locationRepository.getLocationById(
        locationId,
      );

      await this.authRepository.signUp(signUpDto, location);

      return { success: true };
    } catch (error) {
      switch (error.code) {
        case POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
          if (error.detail.includes('email')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 이메일입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          } else if (error.detail.includes('nickname')) {
            throw new HttpException(
              {
                message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
                detail: '중복된 닉네임입니다.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
      }

      console.error();
    }
  }

  async signIn(signInDto: SignInDto) {
    this.authRepository = this.connection.getCustomRepository(AuthRepository);
    const { email, password } = signInDto;

    const user = await this.authRepository.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NOT_FOUND,
          detail: '해당 유저는 존재하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidated = await user.validatedPassword(password);

    if (!isValidated)
      throw new HttpException(
        {
          message: HTTP_ERROR.BAD_REQUEST,
          detail: '올바른 비밀번호가 아닙니다.',
        },
        HttpStatus.BAD_REQUEST,
      );

    const accessToken = this.getAccessToken(user);
    const refreshToken = this.getRefreshToken(user);

    return { accessToken, refreshToken };
  }

  @Transactional()
  async signOut(user: User) {
    this.authRepository = this.connection.getCustomRepository(AuthRepository);
    const userId = user.id;
    await this.authRepository.signOut(userId);
  }
}
