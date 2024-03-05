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
import { CreateCategoryDto } from './createCategory.dto';

@Injectable()
export class CreateCategoryPipe implements PipeTransform<CreateCategoryDto> {
  transform(value: CreateCategoryDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.REQUIRED_STRING('카테고리 명'),
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
