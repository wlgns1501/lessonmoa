import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Connection, QueryFailedError } from 'typeorm';
import { AuthRepository } from 'src/repositories/auth.repository';
import { SignUpDto } from './dtos/signup.dto';
import { LocationRepository } from 'src/repositories/location.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { HTTP_ERROR } from 'src/constants/http-error';

jest.mock('src/repositories/auth.repository');
jest.mock('src/repositories/location.repository');

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  IsolationLevel: { SERIALIZABLE: 'SERIALIZABLE' },
}));

const mockGetCustomRepository = jest.fn((repository) => {
  switch (repository) {
    case AuthRepository:
      return AuthRepository;
    case LocationRepository:
      return LocationRepository;
  }
});

const mockConnection = {
  getCustomRepository: mockGetCustomRepository,
};

describe('AuthService', () => {
  let service: AuthService;
  let connection: Connection;
  let authRepository: AuthRepository;
  let locationRepository: LocationRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: Connection, useValue: mockConnection },
        AuthRepository,
        LocationRepository,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    connection = module.get<Connection>(Connection);
    authRepository = module.get<AuthRepository>(AuthRepository);
    locationRepository = module.get<LocationRepository>(LocationRepository);

    connection.getCustomRepository = jest.fn().mockReturnValue(authRepository);
    connection.getCustomRepository = jest
      .fn()
      .mockReturnValue(locationRepository);
  });

  const mockLocation = {
    id: 1,
    name: '서울특별시 성북구',
    users: undefined,
    places: undefined,
  };

  describe('signUp', () => {
    describe('get location by Id', () => {
      it('해당 location이 없으면 undefined', async () => {
        const mockSignUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: 'testUser',
          locationId: 999,
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(undefined);

        const location = await locationRepository.getLocationById(
          mockSignUpDto.locationId,
        );

        expect(location).toBeUndefined();
      });

      it('해당 location이 없으면 에러 반환', async () => {
        const mockSignUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: 'testUser',
          locationId: 999,
        };

        try {
          await service.signUp(mockSignUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'NOT_FOUND',
            detail: '해당 지역은 존재하지 않습니다.',
          });

          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        }
      });

      it('get location 성공', async () => {
        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        const location = await locationRepository.getLocationById(
          mockLocation.id,
        );

        expect(location).toBe(mockLocation);
      });
    });

    describe('회원가입 테스트', () => {
      it('중복 이메일 일 때 에러 반환', async () => {
        const signUpDto: SignUpDto = {
          email: 'wlgns1501@gmail.com',
          password: 'test',
          nickname: 'testUser',
          locationId: 1,
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        jest.spyOn(authRepository, 'signUp').mockRejectedValue(
          new HttpException(
            {
              message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
              detail: '중복된 이메일입니다.',
            },
            HttpStatus.BAD_REQUEST,
          ),
        );

        try {
          await service.signUp(signUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'DUPLICATED_KEY_ERROR',
            detail: '중복된 이메일입니다.',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('중복 닉네임 일 때 에러 반환', async () => {
        const signUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: '축구 꿈나무',
          locationId: 1,
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        jest.spyOn(authRepository, 'signUp').mockRejectedValue({
          code: '23505',
          detail: 'Key (email)=(test@test.com) already exists.',
        });

        jest.spyOn(service, 'signUp').mockRejectedValue(
          new HttpException(
            {
              message: HTTP_ERROR.DUPLICATED_KEY_ERROR,
              detail: '중복된 닉네임입니다.',
            },
            HttpStatus.BAD_REQUEST,
          ),
        );

        try {
          await service.signUp(signUpDto);
        } catch (error) {
          console.log(error);

          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'DUPLICATED_KEY_ERROR',
            detail: '중복된 닉네임입니다.',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('signUp test', async () => {
        const signUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: 'testUser',
          locationId: 1,
        };

        const mockUser = {
          identifiers: [],
          generatedMaps: [],
          raw: {
            id: 1,
            email: signUpDto.email,
            nickname: signUpDto.nickname,
          },
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        const location = await locationRepository.getLocationById(
          signUpDto.locationId,
        );

        jest.spyOn(authRepository, 'signUp').mockResolvedValue(mockUser);

        await authRepository.signUp(signUpDto, location);

        jest.spyOn(service, 'signUp').mockResolvedValue({ success: true });

        const result = await service.signUp(signUpDto);
        expect(result).toEqual({ success: true });
      });
    });
  });

  // describe('signIn', () => {
  //   describe('회원 가입한 유저인지 확인', () => {
  //     it('유저가 없을 때 에러메세지 반환', async () => {
  //       const signInDto: SignInDto = {
  //         email: 'test@test.com',
  //         password: 'test',
  //       };

  //       const user = await authRepository.findUserByEmail(signInDto.email);

  //       expect(user).toBeUndefined();

  //       try {
  //         await service.signIn(signInDto);
  //       } catch (error) {
  //         expect(error).toBeInstanceOf(HttpException);

  //         expect(error.getResponse()).toEqual({
  //           message: 'NOT_FOUND',
  //           detail: '해당 유저는 존재하지 않습니다.',
  //         });

  //         expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  //       }
  //     });
  //   });
  // });
});
