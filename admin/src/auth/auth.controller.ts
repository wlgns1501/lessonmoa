import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignUpPipe } from './dtos/signup.pipe';
import { SignInPipe } from './dtos/signin.pipe';
import { SignInDto } from './dtos/signin.dto';
import { AdminGuard } from 'src/guards/admin.guard';

const ACCESS_TOKEN_EXPRIRESIN = 1000 * 60 * 60 * 8;
export const REFRESH_TOKEN_EXPRIRESIN = 1000 * 60 * 60 * 24 * 14;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  private setAccessToken(
    response: Response,
    accessToken: string,
    expiresIn: number,
  ) {
    response.cookie('access_token', accessToken, {
      expires: new Date(Date.now() + expiresIn),
    });

    return response;
  }

  private setRefreshToken(
    response: Response,
    refreshToken: string,
    expiresIn: number,
  ) {
    response.cookie('refresh_token', refreshToken, {
      path: '/auth/refresh',
      expires: new Date(Date.now() + expiresIn),
    });

    return response;
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 200, type: Boolean })
  signUp(@Body(new SignUpPipe()) signUpDto: SignUpDto) {
    return this.service.signUp(signUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  async signIn(
    @Body(new SignInPipe()) signInDto: SignInDto,
    @Res() response: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.signIn(signInDto);

    let settledResponse = this.setAccessToken(
      response,
      accessToken,
      ACCESS_TOKEN_EXPRIRESIN,
    );
    settledResponse = this.setRefreshToken(
      settledResponse,
      refreshToken,
      REFRESH_TOKEN_EXPRIRESIN,
    );

    settledResponse.send({ success: true });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(AdminGuard)
  async logout(@Req() req: any, @Res() response: Response) {
    let settledResponse = this.setAccessToken(response, '', 0);
    settledResponse = this.setRefreshToken(settledResponse, '', 0);
    settledResponse.send({ success: true });
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회원 탈퇴' })
  @UseGuards(AdminGuard)
  async signout(@Req() req: any, @Res() response: Response) {
    await this.service.signOut(req.user);

    let settledResponse = this.setAccessToken(response, '', 0);
    settledResponse = this.setRefreshToken(settledResponse, '', 0);
    settledResponse.send({ success: true });
  }
}
