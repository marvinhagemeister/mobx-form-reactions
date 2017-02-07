import { ValidationError } from "./shapes";

const isNullOrUndef = (value: any) => typeof value === "undefined" || value === null;

export const isEmpty = (value: any) => {
  if (typeof value === "string" && value.trim().length === 0) {
    return true;
  }

  return isNullOrUndef(value) || Object.keys(value).length === 0;
};

const isMinLength = (min: number) => (value: any) =>
  !isNullOrUndef(value) && value.length >= min;

const isMaxLength = (max: number) => (value: any) =>
  !isNullOrUndef(value) && value.length <= max;

const isPattern = (regex: RegExp) => (value: any) =>
  !isNullOrUndef(value) && regex.test(value);

const isRange = (min: number, max: number) => (value: any) =>
  !isNullOrUndef(value) && value >= min && value <= max;

// Validators
export const required = (value: any): ValidationError =>
  isEmpty(value) ? { required: true } : {};

export interface IMinLength {
  minLength?: boolean;
}

export const minLength = (min: number) => (value: any): IMinLength =>
  !isMinLength(min)(value) ? { minLength: true } : {};

export interface IMaxLength {
  maxLength?: boolean;
}

export const maxLength = (max: number) => (value: any): IMaxLength =>
  !isMaxLength(max)(value) ? { maxLength: true } : {};

export interface IPattern {
  pattern?: boolean;
}

export const pattern = (regex: RegExp) => (value: any): IPattern =>
  !isPattern(regex)(value) ? { pattern: true } : {};

export interface IRange {
  range?: boolean;
}

export const range = (min: number, max: number) => (value: any): IRange =>
  !isRange(min, max)(value) ? { range: true } : {};

export interface IOneOf {
  oneOf?: boolean;
}

export const oneOf = (haystack: any[]) => (value: any): IOneOf =>
  haystack.indexOf(value) === -1 ? { oneOf: true } : {};

export interface IIsBoolean {
  isBoolean?: boolean;
}

export const isBoolean = (value: any): IIsBoolean =>
  value !== false && value !== true ? { isBoolean: true } : {};

export interface IIsNumber {
  isNumber?: boolean;
}

export const isNumber = (value: any): IIsNumber =>
  typeof value !== "number" ? { isNumber: true } : {};
