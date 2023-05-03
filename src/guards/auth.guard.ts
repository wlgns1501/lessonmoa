import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthRepository } from 'src/repositories/auth.repository';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { HTTP_ERROR } from 'src/constants/http-error';
import * as jwt from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import { User } from 'src/entities/user.entity';

export type JwtPayload = {
  email: string;
  isInstructor: boolean;
};

@Injectable()
export class AuthGuard implements CanActivate {
  private authRepository: AuthRepository;
  constructor(private readonly connection: Connection) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const accessToken = req.get('cookie')?.split('=')[1];

    if (!accessToken) {
      throw new HttpException(
        {
          message: HTTP_ERROR.NEED_LOGIN_OR_REFRESH_TOKEN,
          detail: '로그인이 필요하거나 Refresh Token이 필요합니다.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

      const { email } = verifiedToken as JwtPayload;

      this.authRepository = this.connection.getCustomRepository(AuthRepository);

      const user = await this.authRepository.findOne({ email });

      req['user'] = user;

      return true;
    } catch (error) {
      if (error.hasOwnProperty('expiredAt')) {
        throw new HttpException(
          {
            message: HTTP_ERROR.NEED_LOGIN_OR_REFRESH_TOKEN,
            detail: 'need login or refresh token',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      return false;
    }
  }
}
