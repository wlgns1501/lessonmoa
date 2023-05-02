import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignUpPipe } from './dtos/signup.pipe';

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

  // @Post('/signin')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: '로그인'})
  // async signIn(@Body(new SignInPipe()) signInDto : SignInDto, @Res() : res) {
  //   return
  // }
}
