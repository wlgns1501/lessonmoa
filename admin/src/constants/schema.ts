import * as Joi from 'joi';
import {
  replaceQuote,
  splitSeparator,
  splitSeparatorToNumber,
  titlize,
} from 'src/functions/validation';
import { FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX } from './regex';

export const SCHEMA = {
  PAGINATION: (label: string) => Joi.number().default(1).label(label),

  OPTIONAL_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .allow(null)
      .empty('')
      .default(null)
      .label(label),
  OPTIONAL_ENG_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .empty('')
      .default(null)
      .label(label)
      .alphanum(),
  OPTIONAL_BOOLEAN: (label: string) => Joi.boolean().optional().label(label),
  REQUIRED_BOOLEAN: (label: string) => Joi.boolean().required().label(label),

  OPTIONAL_NUMBER: (label: string) =>
    Joi.number().optional().allow(null).empty('').default(null).label(label),
  OPTIONAL_NUMBER_WITH_DEFAULT: (label: string, defaultValue: number) =>
    Joi.number()
      .optional()
      .allow(null)
      .empty('')
      .default(defaultValue)
      .label(label),
  OPTIONAL_STRING_WITH_REGEX: (label: string, regex: RegExp) =>
    Joi.string().optional().empty('').regex(regex).label(label),

  OPTIONAL_STRING_ARRAY: (label: string) =>
    Joi.array().items(Joi.string().label(label)).default([]).label(label),
  REQUIRED_STRING_ARRAY: (label: string) =>
    Joi.array().items(Joi.string().label(label)).min(1).label(label),
  OPTIONAL_NUMBER_ARRAY: (label: string) =>
    Joi.array().items(Joi.number().label(label)).default([]).label(label),
  REQUIRED_NUMBER_ARRAY: (label: string) =>
    Joi.array().items(Joi.number().label(label)).min(1).label(label),

  OPTIONAL_MULTIPLE_NUMBER: (label: string) =>
    Joi.string().custom(splitSeparatorToNumber, '스플릿실패').label(label),
  OPTIONAL_MULTIPLE_STRING: (label: string) =>
    Joi.string().custom(splitSeparator, '스플릿실패').label(label),

  OPTIONAL_OBJECT_IN_ARRAY_OPTION: (label: string) =>
    Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .required()
            .custom(replaceQuote, '따옴표 제거 실패')
            .label('이름'),
          order: Joi.number().required().label('순서'),
        }),
      )
      .default([])
      .label(label),

  REQUIRED_STRING: (label: string) =>
    Joi.string()
      .required()
      .custom(replaceQuote, '따옴표 제거 실패')
      .label(label),

  REQUIRED_ENG_STRING: (label: string) =>
    Joi.string()
      .required()
      .custom(replaceQuote, '따옴표 제거 실패')
      .label(label)
      .alphanum(),

  REQUIRED_FOR_STRING: (label: string) =>
    Joi.string()
      .required()
      .custom(replaceQuote, '따옴표 제거 실패')
      .custom(titlize, '제목화 실패')
      .label(label)
      .regex(FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX),

  REQUIRED_STRING_ENUM: (label: string, enums: string[]) =>
    Joi.string()
      .required()
      .custom(replaceQuote, '따옴표 제거 실패')
      .valid(...enums)
      .label(label),

  REQUIRED_NUMBER: (label: string) => Joi.number().required().label(label),

  REQUIRED_STRING_WITH_REGEX: (label: string, regex: RegExp) =>
    Joi.string().required().regex(regex).label(label),

  UPDATE_NOTNULL_NUMBER: (label: string) =>
    Joi.number().optional().label(label),
  UPDATE_NULLABLE_NUMBER: (label: string) =>
    Joi.number().optional().allow('').label(label),

  UPDATE_NOTNULL_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .label(label),

  UPDATE_NOTNULL_BOOLEAN: (label: string) =>
    Joi.boolean().optional().label(label),
  UPDATE_NULLABLE_BOOLEAN: (label: string) =>
    Joi.boolean().optional().label(label),

  UPDATE_NOTNULL_ENG_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .label(label)
      .alphanum(),

  UPDATE_NOTNULL_FOR_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .custom(titlize, '제목화 실패')
      .label(label)
      .regex(FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX),

  UPDATE_NOTNULL_STRING_WITH_REGEX: (label: string, regex: RegExp) =>
    Joi.string()
      .optional()
      .regex(regex)
      .custom(replaceQuote, '따옴표 제거 실패')
      .label(label),

  UPDATE_NULLABLE_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .allow('')
      .label(label),

  UPDATE_NULLABLE_ENG_STRING: (label: string) =>
    Joi.string()
      .optional()
      .custom(replaceQuote, '따옴표 제거 실패')
      .allow('')
      .label(label)
      .alphanum(),

  UPDATE_NULLABLE_STRING_WITH_REGEX: (label: string, regex: RegExp) =>
    Joi.string()
      .optional()
      .regex(regex)
      .custom(replaceQuote, '따옴표 제거 실패')
      .allow('')
      .label(label),

  UPDATE_NULLABLE_NUMBER_ARRAY: (label: string) =>
    Joi.array().items(Joi.number().label(label)).label(label),
  UPDATE_NULLABLE_STRING_ARRAY: (label: string) =>
    Joi.array().items(Joi.string().label(label)).label(label),
  UPDATE_NOTNULL_NUMBER_ARRAY: (label: string) =>
    Joi.array().items(Joi.number().label(label)).min(1).label(label),

  UPDATE_NULLABLE_OBJECT_IN_ARRAY_OPTION: (label: string) =>
    Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .optional()
            .custom(replaceQuote, '따옴표 제거 실패')
            .allow('')
            .label('이름'),
          order: Joi.number().optional().allow('').label('순서'),
        }),
      )
      .default([])
      .label(label),

  PAGE: () => Joi.number().default(1).label('페이지번호'),
  PAGE_SIZE: (pageSize?: number) =>
    Joi.number()
      .default(pageSize || 10)
      .label('페이지수'),
};
