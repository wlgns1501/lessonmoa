"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEMA = void 0;
const Joi = require("joi");
const validation_1 = require("../functions/validation");
const regex_1 = require("./regex");
exports.SCHEMA = {
    PAGINATION: (label) => Joi.number().default(1).label(label),
    OPTIONAL_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .allow(null)
        .empty('')
        .default(null)
        .label(label),
    OPTIONAL_ENG_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .empty('')
        .default(null)
        .label(label)
        .alphanum(),
    OPTIONAL_BOOLEAN: (label) => Joi.boolean().optional().label(label),
    REQUIRED_BOOLEAN: (label) => Joi.boolean().required().label(label),
    OPTIONAL_NUMBER: (label) => Joi.number().optional().allow(null).empty('').default(null).label(label),
    OPTIONAL_NUMBER_WITH_DEFAULT: (label, defaultValue) => Joi.number()
        .optional()
        .allow(null)
        .empty('')
        .default(defaultValue)
        .label(label),
    OPTIONAL_STRING_WITH_REGEX: (label, regex) => Joi.string().optional().empty('').regex(regex).label(label),
    OPTIONAL_STRING_ARRAY: (label) => Joi.array().items(Joi.string().label(label)).default([]).label(label),
    REQUIRED_STRING_ARRAY: (label) => Joi.array().items(Joi.string().label(label)).min(1).label(label),
    OPTIONAL_NUMBER_ARRAY: (label) => Joi.array().items(Joi.number().label(label)).default([]).label(label),
    REQUIRED_NUMBER_ARRAY: (label) => Joi.array().items(Joi.number().label(label)).min(1).label(label),
    OPTIONAL_MULTIPLE_NUMBER: (label) => Joi.string().custom(validation_1.splitSeparatorToNumber, '스플릿실패').label(label),
    OPTIONAL_MULTIPLE_STRING: (label) => Joi.string().custom(validation_1.splitSeparator, '스플릿실패').label(label),
    OPTIONAL_OBJECT_IN_ARRAY_OPTION: (label) => Joi.array()
        .items(Joi.object({
        name: Joi.string()
            .required()
            .custom(validation_1.replaceQuote, '따옴표 제거 실패')
            .label('이름'),
        order: Joi.number().required().label('순서'),
    }))
        .default([])
        .label(label),
    REQUIRED_STRING: (label) => Joi.string()
        .required()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .label(label),
    REQUIRED_ENG_STRING: (label) => Joi.string()
        .required()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .label(label)
        .alphanum(),
    REQUIRED_FOR_STRING: (label) => Joi.string()
        .required()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .custom(validation_1.titlize, '제목화 실패')
        .label(label)
        .regex(regex_1.FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX),
    REQUIRED_STRING_ENUM: (label, enums) => Joi.string()
        .required()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .valid(...enums)
        .label(label),
    REQUIRED_NUMBER: (label) => Joi.number().required().label(label),
    REQUIRED_STRING_WITH_REGEX: (label, regex) => Joi.string().required().regex(regex).label(label),
    UPDATE_NOTNULL_NUMBER: (label) => Joi.number().optional().label(label),
    UPDATE_NULLABLE_NUMBER: (label) => Joi.number().optional().allow('').label(label),
    UPDATE_NOTNULL_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .label(label),
    UPDATE_NOTNULL_BOOLEAN: (label) => Joi.boolean().optional().label(label),
    UPDATE_NULLABLE_BOOLEAN: (label) => Joi.boolean().optional().label(label),
    UPDATE_NOTNULL_ENG_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .label(label)
        .alphanum(),
    UPDATE_NOTNULL_FOR_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .custom(validation_1.titlize, '제목화 실패')
        .label(label)
        .regex(regex_1.FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX),
    UPDATE_NOTNULL_STRING_WITH_REGEX: (label, regex) => Joi.string()
        .optional()
        .regex(regex)
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .label(label),
    UPDATE_NULLABLE_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .allow('')
        .label(label),
    UPDATE_NULLABLE_ENG_STRING: (label) => Joi.string()
        .optional()
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .allow('')
        .label(label)
        .alphanum(),
    UPDATE_NULLABLE_STRING_WITH_REGEX: (label, regex) => Joi.string()
        .optional()
        .regex(regex)
        .custom(validation_1.replaceQuote, '따옴표 제거 실패')
        .allow('')
        .label(label),
    UPDATE_NULLABLE_NUMBER_ARRAY: (label) => Joi.array().items(Joi.number().label(label)).label(label),
    UPDATE_NULLABLE_STRING_ARRAY: (label) => Joi.array().items(Joi.string().label(label)).label(label),
    UPDATE_NOTNULL_NUMBER_ARRAY: (label) => Joi.array().items(Joi.number().label(label)).min(1).label(label),
    UPDATE_NULLABLE_OBJECT_IN_ARRAY_OPTION: (label) => Joi.array()
        .items(Joi.object({
        name: Joi.string()
            .optional()
            .custom(validation_1.replaceQuote, '따옴표 제거 실패')
            .allow('')
            .label('이름'),
        order: Joi.number().optional().allow('').label('순서'),
    }))
        .default([])
        .label(label),
    PAGE: () => Joi.number().default(1).label('페이지번호'),
    PAGE_SIZE: (pageSize) => Joi.number()
        .default(pageSize || 10)
        .label('페이지수'),
};
//# sourceMappingURL=schema.js.map