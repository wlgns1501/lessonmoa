export const PHONE_REGEX = /(^010[0-9]{8}$)|(^toss_payment$)|(^ffeed_admin$)/;
export const NICKNAME_REGEX = /^[a-z0-9_ -]{2,20}$/;
export const NAME_REGEX = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|{1,19}\*]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#^()<>~])[A-Za-z\d@$!%*?&#^()<>~]{6,}$/;
export const HANGUEL_NUMBER_ALPHABET_DASH_AND_SPACE_30_REGEX =
  /^[가-힣a-zA-Z-&\d\s]{1,30}$/;
export const NUMBER_CHECK = /[0-9]/;
export const HANGUEL_ALPHABET_DASH_AND_SPACE_30 = /[가-힣a-zA-Z-&\s]{1,30}$/;

export const SPECIALCHAR_CHECK_REGEX =
  /[`~!@#$%^&*()-_+=<>,;:'."{}[]|\\"\\;:\/?]/;

export const SPECIALCHAR_CHECK_EXCEPT_REGEX =
  /[`~!@#$%^*()_+=<>,;:'."{}[]|\\"\\;:\/?]/;
export const ADMIN_NICKNAME_REGEX = /^((?!admin).)*$/;
export const FOREIGN_NUMBER_SPECIALCHAR_CHECK_REGEX = /^[u0000-u2122]{1,}$/;
export const VERIFY_NUMBER_REGEX = /\d{6}/;
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
