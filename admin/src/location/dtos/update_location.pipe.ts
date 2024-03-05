import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';
import { UpdateLocationDto } from './update_location.dto';

@Injectable()
export class UpdateLocationPipe implements PipeTransform<UpdateLocationDto> {
  transform(value: UpdateLocationDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.UPDATE_NOTNULL_STRING('지역 이름'),
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
