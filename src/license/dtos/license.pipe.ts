import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { LicenseDto } from './license.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';

export class LicensePipe implements PipeTransform<LicenseDto> {
  transform(value: LicenseDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.REQUIRED_STRING('자격증 이름'),
      imageUrl: SCHEMA.REQUIRED_STRING('이미지 Url'),
      userId: SCHEMA.REQUIRED_NUMBER('userId'),
    });

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
