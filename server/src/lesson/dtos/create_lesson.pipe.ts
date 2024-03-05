import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateLessonDto } from './create_lesson.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class CreateLessonPipe implements PipeTransform<CreateLessonDto> {
  transform(value: CreateLessonDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.REQUIRED_STRING('레슨 명'),
      content: SCHEMA.REQUIRED_STRING('레슨 내용'),
      userLimit: SCHEMA.REQUIRED_NUMBER('수업 최대 인원'),
      level: SCHEMA.REQUIRED_STRING('레슨 레벨'),
      startDate: SCHEMA.REQUIRED_STRING('시작 시간'),
      endDate: SCHEMA.REQUIRED_STRING('종료 시간'),
      subCategoryId: SCHEMA.REQUIRED_NUMBER('서브 카테고리 Id'),
      placeId: SCHEMA.REQUIRED_NUMBER('장소 Id'),
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
