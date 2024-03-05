import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { GetLessonsDto } from './get_lessons.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class GetLessonsPipe implements PipeTransform<GetLessonsDto> {
  transform(value: GetLessonsDto) {
    const validationSchema = Joi.object({
      page: SCHEMA.PAGE(),
      pageSize: SCHEMA.PAGE_SIZE(),
      subCategoryId: SCHEMA.OPTIONAL_NUMBER('서브 카테고리 Id'),
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
