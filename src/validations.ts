import { FieldValue } from "./Field";

export const required = (value: FieldValue | any[] | object) => {
  if (
    (typeof value === "string" && value.trim().length === 0) ||
    value === null ||
    value === undefined ||
    Object.keys(value).length === 0
  ) {
    return "required";
  }
};

export const minLength = (min: number) => (value: string | any[]) =>
  value.length < min ? "minLength" : undefined;

export const maxLength = (max: number) => (value: string | any[]) =>
  value.length > max ? "maxLength" : undefined;

export const pattern = (regex: RegExp) => (value: string) =>
  !regex.test(value) ? "pattern" : undefined;
