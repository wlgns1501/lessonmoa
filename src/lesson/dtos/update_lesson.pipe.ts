import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateLessonDto } from './update_lesson.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class UpdateLessonPipe implements PipeTransform<UpdateLessonDto> {
  transform(value: UpdateLessonDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.UPDATE_NOTNULL_STRING('레슨 명'),
      content: SCHEMA.UPDATE_NOTNULL_STRING('레슨 내용'),
      userLimit: SCHEMA.UPDATE_NOTNULL_NUMBER('수업 최대 인원'),
      level: SCHEMA.REQUIRED_STRING('레벨 레벨'),
      startDate: SCHEMA.UPDATE_NOTNULL_STRING('시작 시간'),
      endDate: SCHEMA.UPDATE_NOTNULL_STRING('종료 시간'),
      subCategoryId: SCHEMA.UPDATE_NOTNULL_NUMBER('서브 카테고리 Id'),
      placeId: SCHEMA.UPDATE_NOTNULL_NUMBER('장소 Id'),
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
