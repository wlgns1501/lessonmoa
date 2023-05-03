import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignUpPipe } from './dtos/signup.pipe';
import { SignInPipe } from './dtos/signin.pipe';
import { SignInDto } from './dtos/signin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

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
    return this.service.signIn(signInDto);
  }
}
