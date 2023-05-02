"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_REGEX = exports.VERIFY_NUMBER_REGEX = exports.FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX = exports.ADMIN_NICKNAME_REGEX = exports.SPECIALCHAR_CHECK_EXCEPT_REGEX = exports.SPECIALCHAR_CHECK_REGEX = exports.HANGUEL_ALPHABET_DASH_AND_SPACE_30 = exports.NUMBER_CHECK = exports.HANGUEL_NUMBER_ALPHABET_DASH_AND_SPACE_30_REGEX = exports.PASSWORD_REGEX = exports.NAME_REGEX = exports.NICKNAME_REGEX = exports.PHONE_REGEX = void 0;
exports.PHONE_REGEX = /(^010[0-9]{8}$)|(^toss_payment$)|(^ffeed_admin$)/;
exports.NICKNAME_REGEX = /^[a-z0-9_ -]{2,20}$/;
exports.NAME_REGEX = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|{1,19}\*]+$/;
exports.PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#^()<>~])[A-Za-z\d@$!%*?&#^()<>~]{6,}$/;
exports.HANGUEL_NUMBER_ALPHABET_DASH_AND_SPACE_30_REGEX = /^[가-힣a-zA-Z-&\d\s]{1,30}$/;
exports.NUMBER_CHECK = /[0-9]/;
exports.HANGUEL_ALPHABET_DASH_AND_SPACE_30 = /[가-힣a-zA-Z-&\s]{1,30}$/;
exports.SPECIALCHAR_CHECK_REGEX = /[`~!@#$%^&*()-_+=<>,;:'."{}[]|\\"\\;:\/?]/;
exports.SPECIALCHAR_CHECK_EXCEPT_REGEX = /[`~!@#$%^*()_+=<>,;:'."{}[]|\\"\\;:\/?]/;
exports.ADMIN_NICKNAME_REGEX = /^((?!admin).)*$/;
exports.FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX = /^[u0000-u2122]{1,}$/;
exports.VERIFY_NUMBER_REGEX = /\d{6}/;
exports.EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//# sourceMappingURL=regex.js.map