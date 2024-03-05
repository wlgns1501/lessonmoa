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

@Injectable()
export class GetPlacesPipe implements PipeTransform<GetPlacesDto> {
  transform(value: GetPlacesDto) {
    const validationSchema = Joi.object({
      locationId: SCHEMA.OPTIONAL_NUMBER('지역 Id'),
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
