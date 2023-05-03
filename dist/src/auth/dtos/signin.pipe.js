"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInPipe = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../../constants/schema");
const regex_1 = require("../../constants/regex");
const Joi = require("joi");
const http_error_1 = require("../../constants/http-error");
let SignInPipe = class SignInPipe {
    transform(value) {
        const validationSchema = Joi.object({
            email: schema_1.SCHEMA.REQUIRED_STRING_WITH_REGEX('이메일', regex_1.EMAIL_REGEX),
            password: schema_1.SCHEMA.REQUIRED_STRING('비밀번호'),
        });
        const { error, value: validatedValue } = validationSchema.validate(value);
        if (error) {
            throw new common_1.HttpException({
                message: http_error_1.HTTP_ERROR.VALIDATION_ERROR,
                detail: error.details[0].context.label,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return validatedValue;
    }
};
SignInPipe = __decorate([
    (0, common_1.Injectable)()
], SignInPipe);
exports.SignInPipe = SignInPipe;
//# sourceMappingURL=signin.pipe.js.map