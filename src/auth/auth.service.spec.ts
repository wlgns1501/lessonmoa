import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  BaseEntity,
  Connection,
  Repository,
  getCustomRepository,
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthRepository } from 'src/repositories/auth.repository';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { LocationRepository } from 'src/repositories/location.repository';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;
  let connection: Connection;
  let locationRepository: LocationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: Connection, useClass: getCustomRepository },
        ,
        AuthRepository,
        LocationRepository,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
    connection = module.get<Connection>(Connection);
    locationRepository = module.get<LocationRepository>(LocationRepository);
  });

  describe('signUp', () => {
    describe('회원가입 테스트', () => {
      it('회원 가입 테스트', async () => {
        const signUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          locationId: 1,
          nickname: 'testUser',
        };

        const hashedPassword = await bcrypt.hash(signUpDto.password, 9);

        const mockLocation = { id: 1, name: '서울특별시 성북구' };

        jest
          .spyOn(locationRepository, 'getLocationById')
          .mockResolvedValue(mockLocation);

        const location = await locationRepository.getLocation(
          signUpDto.locationId,
        );

        const mockUser = {
          identifiers: [{ id: 38 }],
          generatedMaps: [
            {
              id: 38,
              isInstructor: false,
              isAdmin: false,
              createdAt: '2023-05-16T05:11:19.124Z',
            },
          ],
          raw: [
            {
              id: 38,
              isInstructor: false,
              isAdmin: false,
              createdAt: '2023-05-16T05:11:19.124Z',
            },
          ],
        };

        jest.spyOn(authRepository, 'signUp').mockResolvedValue(mockUser);

        // await authRepository.signUp(signUpDto, location);

        const result = await service.signUp(signUpDto);

        expect(result).toEqual({ success: true });
      });
    });
  });
});
