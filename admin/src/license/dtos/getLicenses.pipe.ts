import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import { HTTP_ERROR } from 'src/constants/http-error';
import { SCHEMA } from 'src/constants/schema';

@Injectable()
export class getLicensesPipe implements PipeTransform {
  transform(value: any) {
    const validationSchema = Joi.object({
      page: SCHEMA.PAGE(),
      pageSize: SCHEMA.PAGE_SIZE(),
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
