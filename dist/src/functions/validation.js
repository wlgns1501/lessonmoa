"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titlize = exports.splitSeparatorToNumber = exports.splitSeparator = exports.replaceQuote = void 0;
const replaceQuote = (value, helpers) => {
    return value.replace(/'/gi, `''`);
};
exports.replaceQuote = replaceQuote;
const splitSeparator = (value) => {
    return value.split('|');
};
exports.splitSeparator = splitSeparator;
const splitSeparatorToNumber = (value) => {
    return value.split('|').map((x) => +x);
};
exports.splitSeparatorToNumber = splitSeparatorToNumber;
const titlize = (value) => {
    return value.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()).split('(')[0];
};
exports.titlize = titlize;
//# sourceMappingURL=validation.js.map