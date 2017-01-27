import { ValidationError } from "./shapes";

const isNullOrUndef = (value: any) => typeof value === "undefined" || value === null;

const isRequired = (value: any) =>
  value !== "" && !isNullOrUndef(value) &&
  ((value as any).length > 0 || Object.keys(value).length > 0);

const isMinLength = (min: number) => (value: any) =>
  !isNullOrUndef(value) && value.length >= min;

const isMaxLength = (max: number) => (value: any) =>
  !isNullOrUndef(value) && value.length <= max;

const isPattern = (regex: RegExp) => (value: any) =>
  !isNullOrUndef(value) && regex.test(value);

const isRange = (min: number, max: number) => (value: any) =>
  !isNullOrUndef(value) && value >= min && value <= max;

// Validators
export const required = (value: any): ValidationError | null =>
  !isRequired(value) ? { required: true } : null;

export interface IMinLength {
  minLength: boolean;
}

export const minLength = (min: number) => (value: any): IMinLength | null =>
  !isMinLength(min)(value) ? { minLength: true } : null;

export interface IMaxLength {
  maxLength: boolean;
}

export const maxLength = (max: number) => (value: any): IMaxLength | null =>
  !isMaxLength(max)(value) ? { maxLength: true } : null;

export interface IPattern {
  pattern: boolean;
}

export const pattern = (regex: RegExp) => (value: any): IPattern | null =>
  !isPattern(regex)(value) ? { pattern: true } : null;

export interface IRange {
  range: boolean;
}

export const range = (min: number, max: number) => (value: any): IRange | null =>
  !isRange(min, max)(value) ? { range: true } : null;
