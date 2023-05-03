import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { SCHEMA } from 'src/constants/schema';
import { EMAIL_REGEX } from 'src/constants/regex';
import * as Joi from 'joi';
import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class SignInPipe implements PipeTransform<SignInDto> {
  transform(value: SignInDto) {
    const validationSchema = Joi.object({
      email: SCHEMA.REQUIRED_STRING_WITH_REGEX('이메일', EMAIL_REGEX),
      password: SCHEMA.REQUIRED_STRING('비밀번호'),
    });
    console.log(value);

    const { error, value: validatedValue } = validationSchema.validate(value);

    if (error) {
      throw new HttpException(
        {
          message: HTTP_ERROR.VALIDATION_ERROR,
          detail: error.details[0].context.label,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return validatedValue;
  }
}
