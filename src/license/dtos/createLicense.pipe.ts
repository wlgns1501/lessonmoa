import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { CreateLicenseDto } from './createLicense.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';

export class createLicensePipe implements PipeTransform<CreateLicenseDto> {
  transform(value: CreateLicenseDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.REQUIRED_STRING('자격증 이름'),
      imageUrl: SCHEMA.REQUIRED_STRING('이미지 Url'),
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
