export const replaceQuote = (value: string, helpers: any) => {
  return value.replace(/'/gi, `''`);
};

export const splitSeparator = (value: string) => {
  return value.split('|');
};

export const splitSeparatorToNumber = (value: string) => {
  return value.split('|').map((x: any) => +x);
};

export const titlize = (value: string) => {
  return value.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()).split('(')[0];
};
