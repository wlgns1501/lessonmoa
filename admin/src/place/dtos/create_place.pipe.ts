import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { GetPlacesDto } from './get_places.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';
import { CreatePlaceDto } from './create_location.dto';

@Injectable()
export class CreatePlacePipe implements PipeTransform<CreatePlaceDto> {
  transform(value: CreatePlaceDto) {
    const validationSchema = Joi.object({
      locationId: SCHEMA.REQUIRED_NUMBER('지역 Id'),
      name: SCHEMA.REQUIRED_STRING('이름'),
      address: SCHEMA.REQUIRED_STRING('주소'),
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
