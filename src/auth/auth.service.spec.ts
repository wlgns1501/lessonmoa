import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { AuthRepository } from 'src/repositories/auth.repository';
import { SignUpDto } from './dtos/signup.dto';
import { LocationRepository } from 'src/repositories/location.repository';
import { HttpException } from '@nestjs/common';

jest.mock('src/repositories/auth.repository');
jest.mock('src/repositories/location.repository');

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  IsolationLevel: { SERIALIZABLE: 'SERIALIZABLE' },
}));

const mockGetCustomRepository = jest.fn((repository) => {
  if (repository === AuthRepository) {
    return new AuthRepository();
  } else if (repository === LocationRepository) {
    return new LocationRepository();
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
    const module: TestingModule = await Test.createTestingModule({
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
  });

  describe('signUp', () => {
    describe('get location by Id', () => {
      test('해당 location이 없으면 location === undefined', async () => {
        const mockSignUpDto = {
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

      test('해당 location이 없으면 404 에러 반환', async () => {
        const mockSignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: 'testUser',
          locationId: 999,
        };

        await expect(service.signUp(mockSignUpDto)).rejects.toThrowError(
          HttpException,
        );
      });

      it('get location 성공', async () => {
        const mockLocation = {
          id: 1,
          name: '서울특별시 성북구',
          places: null,
          users: null,
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        const location = await locationRepository.getLocationById(1);

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

        const mockLocation = {
          id: 1,
          name: '서울특별시 성북구',
          places: null,
          users: null,
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        await expect(service.signUp(signUpDto)).rejects.toThrowError(
          HttpException,
        );
      });

      it('signUp test', async () => {
        const signUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: 'testUser',
          locationId: 1,
        };

        const mockLocation = {
          id: 1,
          name: '서울특별시 성북구',
          places: null,
          users: null,
        };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        jest.spyOn(service, 'signUp').mockResolvedValue({ success: true });

        const result = await service.signUp(signUpDto);

        expect(result).toEqual({ success: true });
      });
    });
  });
});
