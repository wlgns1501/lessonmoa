// jest.mock('src/repositories/location.repository');

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { AuthRepository } from 'src/repositories/auth.repository';
import { SignUpDto } from './dtos/signup.dto';
import { LocationRepository } from 'src/repositories/location.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Location } from 'src/entities/location.entity';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  IsolationLevel: { SERIALIZABLE: 'SERIALIZABLE' },
}));

const mockGetCustomRepository = jest.fn();

const mockConnection = {
  getCustomRepository: mockGetCustomRepository,
};

const mockLocation = { id: 1, name: '서울특별시 성북구' };
const mockLocationRepository = {
  getLocationById: jest.fn().mockImplementation((locationId) => {
    if (locationId === 1) {
      return Promise.resolve(mockLocation);
    } else {
      return Promise.resolve(null);
    }
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;
  let connection: Connection;
  let locationRepository: LocationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: Connection, useValue: mockConnection },
        // {
        //   provide: getRepositoryToken(User),
        //   useValue: mockUserRepository,
        // },
        {
          provide: LocationRepository,
          useValue: mockLocationRepository,
        },
        AuthRepository,
        // LocationRepository,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    connection = module.get<Connection>(Connection);
    authRepository = module.get<AuthRepository>(AuthRepository);
    locationRepository = module.get<LocationRepository>(LocationRepository);
  });

  describe('signUp', () => {
    describe('회원가입 테스트', () => {
      it('회원 가입 테스트', async () => {
        const signUpDto: SignUpDto = {
          email: 'wlgns1501@naver.com',
          password: 'gkstlsyjh116!',
          locationId: 1,
          nickname: '축구꿈나무',
        };

        const mockLocation = { id: 1, name: '서울특별시 성북구' };

        // const aa = jest
        //   .spyOn(locationRepository, 'getLocationById')
        //   .mockResolvedValue(mockLocation);

        const location = await locationRepository.getLocationById(
          signUpDto.locationId,
        );

        const mockUser = {
          identifiers: [{ id: 10 }],
          generatedMaps: [
            {
              id: 10,
              isInstructor: false,
              isAdmin: false,
              createdAt: '2023-05-08 15:56:06.877',
            },
          ],
          raw: [
            {
              id: 10,
              isInstructor: false,
              isAdmin: false,
              createdAt: '2023-05-08 15:56:06.877',
            },
          ],
        };

        jest.spyOn(authRepository, 'signUp').mockResolvedValue(mockUser);

        const result = await service.signUp(signUpDto);

        expect(result).toEqual({ success: true });
      });
    });
  });
});
