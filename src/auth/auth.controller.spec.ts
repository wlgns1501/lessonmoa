import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from 'src/repositories/auth.repository';
import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';

class MockConnection {}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: Connection, useClass: MockConnection },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('회원 가입 테스트', async () => {
      const dto: SignUpDto = {
        email: 'test@test.com',
        password: 'test',
        locationId: 1,
        nickname: 'testUser',
      };

      jest.spyOn(service, 'signUp').mockResolvedValue({ success: true });
      const result = await controller.signUp(dto);

      expect(result).toEqual({ success: true });
    });
  });
});
