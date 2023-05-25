import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { SignUpPipe } from './dtos/signup.pipe';
import { HttpException, HttpStatus } from '@nestjs/common';

class MockConnection {}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let signUpPipe: SignUpPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: Connection, useClass: MockConnection },
        SignUpPipe,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    signUpPipe = new SignUpPipe();
  });

  describe('signUp', () => {
    describe('signUpDto', () => {
      it('email의 형식이 아닐때 에러 반환', () => {
        const signUpDto = {
          email: 'email',
          password: 'test',
          locationId: 1,
          nickname: 'testUser',
        };

        try {
          signUpPipe.transform(signUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '이메일',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('email이 포함이 되지 않았을 때', async () => {
        const notExistEmailSignUpDto = {
          password: 'test',
          locationId: 1,
          nickname: 'testUser',
        } as SignUpDto;

        try {
          signUpPipe.transform(notExistEmailSignUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '이메일',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('password가 포함되지 않았을 때', async () => {
        const notExistPasswordSignUpDto = {
          email: 'test@test.com',
          locationId: 1,
          nickname: 'testUser',
        } as SignUpDto;

        try {
          signUpPipe.transform(notExistPasswordSignUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '비밀번호',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('locationId가 포함되지 않았을 때', async () => {
        const notExistLocationIdSignUpDto = {
          email: 'test@test.com',
          password: 'test',
          nickname: 'testUser',
        } as SignUpDto;

        try {
          signUpPipe.transform(notExistLocationIdSignUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '지역 Id',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('nickname이 포함되지 않았을 때', async () => {
        const notExistNicknameSignUpDto = {
          email: 'test@test.com',
          password: 'test',
          locationId: 1,
        } as SignUpDto;

        try {
          signUpPipe.transform(notExistNicknameSignUpDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '닉네임',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });
    });

    describe('signup success', () => {
      it('signUpPipe에서 validaiton이 되어 나온 value 체크', async () => {
        const signUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          locationId: 1,
          nickname: 'testUser',
        };

        const validatedValue = signUpPipe.transform(signUpDto);

        expect(validatedValue).toStrictEqual(signUpDto);
      });
      it('회원 가입 성공', async () => {
        const signUpDto: SignUpDto = {
          email: 'test@test.com',
          password: 'test',
          locationId: 1,
          nickname: 'testUser',
        };

        jest.spyOn(service, 'signUp').mockResolvedValue({ success: true });
        const result = await controller.signUp(signUpDto);

        expect(result).toEqual({ success: true });
      });
    });
  });
});
