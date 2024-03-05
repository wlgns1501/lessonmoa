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
import { UpdateSubCategoryDto } from './updateSubCategory.dto';

@Injectable()
export class UpdateSubCategoryPipe
  implements PipeTransform<UpdateSubCategoryDto>
{
  transform(value: UpdateSubCategoryDto) {
    const validationSchema = Joi.object({
      name: SCHEMA.UPDATE_NOTNULL_STRING('서브 카테고리 명'),
      categoryId: SCHEMA.UPDATE_NOTNULL_NUMBER('카테고리 Id'),
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
