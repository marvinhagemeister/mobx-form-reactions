import { AsyncValidateFn, Field } from "..";

export const isHello = (field: Field) =>
  field.value !== "hello" ? "hello" : undefined;

export const asyncIsHello: AsyncValidateFn<any> = (field: Field) =>
  new Promise(res => setTimeout(() => res(isHello(field)), 10));

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
