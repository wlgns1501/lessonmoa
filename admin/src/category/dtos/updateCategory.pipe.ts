import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateCategoryDto } from './updateCategory.dto';
import * as Joi from 'joi';
import { SCHEMA } from 'src/constants/schema';
import { HTTP_ERROR } from 'src/constants/http-error';

@Injectable()
export class UpdateCategoryPipe implements PipeTransform<UpdateCategoryDto> {
  transform(value: UpdateCategoryDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.UPDATE_NOTNULL_STRING('카테고리 명'),
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
