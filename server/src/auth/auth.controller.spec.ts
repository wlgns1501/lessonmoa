import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { SignUpPipe } from './dtos/signup.pipe';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignInPipe } from './dtos/signin.pipe';
import { SignInDto } from './dtos/signin.dto';
import { Response } from 'express';

class MockConnection {}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let signUpPipe: SignUpPipe;
  let signInPipe: SignInPipe;
  let response: Response;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: Connection, useClass: MockConnection },
        SignUpPipe,
        SignInPipe,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    signUpPipe = new SignUpPipe();
    signInPipe = new SignInPipe();
  });

  describe('signUp', () => {
    describe('signUpDto', () => {
      it('email의 형식이 아닐때 에러 반환', () => {
        const signUpDto: SignUpDto = {
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

  describe('signIn', () => {
    describe('signInPipe test', () => {
      it('email이 포함되지 않았을 때', () => {
        const notExistEmailSignInDto = {
          password: 'test',
        } as SignInDto;

        try {
          signInPipe.transform(notExistEmailSignInDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '이메일',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('password가 포함이 되지 않았을 때', () => {
        const notExistPasswordSignInDto = {
          email: 'test@test.com',
        } as SignInDto;

        try {
          signInPipe.transform(notExistPasswordSignInDto);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);

          expect(error.getResponse()).toEqual({
            message: 'VALIDATION_ERROR',
            detail: '비밀번호',
          });

          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });
    });

    describe('signin success', () => {
      it('signIpPipe에서 validaiton이 되어 나온 value 체크', async () => {
        const signInDto: SignInDto = {
          email: 'test@test.com',
          password: 'test',
        };

        const validatedValue = signInPipe.transform(signInDto);

        expect(validatedValue).toStrictEqual(signInDto);
      });
      it('로그인 성공', async () => {
        // const signInDto: SignInDto = {
        //   email: 'test@test.com',
        //   password: 'test',
        // };
        // jest.spyOn(service, 'signIn').mockResolvedValue({
        //   accessToken: 'access_token',
        //   refreshToken: 'refresh_token',
        // });
        // const result = await controller.signIn(signInDto, response);
        // console.log(result);
        // expect(result).toEqual({ success: true });
      });
    });
  });
});
