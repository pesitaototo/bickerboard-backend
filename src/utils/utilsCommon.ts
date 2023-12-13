export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isInt = (num: unknown): num is number => {
  return typeof num === 'number';
};