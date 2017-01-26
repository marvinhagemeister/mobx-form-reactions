const isNullOrUndef = (value: any) => typeof value === "undefined" || value === null;

export const required = (value: any) =>
  value !== "" && !isNullOrUndef(value) &&
  ((value as any).length > 0 || Object.keys(value).length > 0);

export const minLength = (min: number) => (value: any) =>
  !isNullOrUndef(value) && value.length >= min;

export const maxLength = (max: number) => (value: any) =>
  !isNullOrUndef(value) && value.length <= max;

export const pattern = (regex: RegExp) => (value: any) =>
  !isNullOrUndef(value) && regex.test(value);

export const range = (min: number, max: number) => (value: any) =>
  !isNullOrUndef(value) && value >= min && value <= max;
