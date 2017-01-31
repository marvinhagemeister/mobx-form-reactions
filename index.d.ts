declare module "mobx-form-reactions" {
  export interface FieldCache {
    [key: string]: AbstractFormControl;
  }

  export interface AbstractFormControl {
    errors: ValidationError;
    validating: boolean;
    valid: boolean;
    reset(): void;
    validate(): Promise<boolean>;
  }

  export interface LocalFormControls {
    [name: string]: Field;
  }

  export interface FieldOptions {
    disabled?: boolean;
    validator?: Validator<any>;
  }

  export interface FormGroupOptions {
    validator?: Validator<any>;
  }

  export interface ValidationError {
    [error: string]: any;
  }

  export type Validator<T> = (value: T) => ValidationError | Promise<ValidationError>;

  /** Apply synchronous validations */
  export const combine: <R extends ValidationError>(...funcs: Validator<R>[]) => (value: any) => Partial<R>;
  /** Apply asynchronous validations */
  export const combineAsync: <R extends ValidationError>(...funcs: Validator<R>[]) => (value: any) => Promise<Partial<R>>;

  export class Field implements AbstractFormControl {
    validator: Validator<any>;
    errors: ValidationError;
    initial: boolean;
    disabled: boolean;
    validating: boolean;
    _value: any;
    defaultValue: any;
    constructor(options?: FieldOptions);
    constructor(defaultValue: string | number | boolean | null, options?: FieldOptions);
    readonly valid: boolean;
    readonly value: any;
    reset(): void;
    setValue(value: any): void;
    validate(): Promise<boolean>;
  }

  export class FieldArray implements AbstractFormControl {
    validator: Validator<any>;
    _validating: boolean;
    fields: AbstractFormControl[];
    errors: ValidationError;
    constructor(fields?: AbstractFormControl[]);
    readonly valid: boolean;
    readonly validating: boolean;
    validate(): Promise<boolean>;
    removeAt(index: number): void;
    insert(index: number, field: AbstractFormControl): void;
    push(...fields: AbstractFormControl[]): void;
    reset(): void;
    submit(): Object;
  }

  export class FormGroup<T extends FieldCache> implements AbstractFormControl {
    validator: Validator<any>;
    errors: ValidationError;
    fields: T;
    private _validating;
    constructor(fields: T, options?: FormGroupOptions);
    readonly valid: boolean;
    readonly validating: boolean;
    fieldKeys(): string[];
    setValidating(value: boolean): void;
    reset(): void;
    validate(): Promise<boolean>;
    submit(): any;
  }

  export const required: (value: any) => ValidationError;

  export interface IMinLength {
    minLength?: boolean;
  }

  export const minLength: (min: number) => (value: any) => IMinLength;

  export interface IMaxLength {
    maxLength?: boolean;
  }

  export const maxLength: (max: number) => (value: any) => IMaxLength;

  export interface IPattern {
    pattern?: boolean;
  }

  export const pattern: (regex: RegExp) => (value: any) => IPattern;

  export interface IRange {
    range?: boolean;
  }

  export const range: (min: number, max: number) => (value: any) => IRange;

  export interface IOneOf {
    oneOf?: boolean;
  }

  export const oneOf: (haystack: any[]) => (value: any) => IOneOf;

  export interface IIsBoolean {
    isBoolean?: boolean;
  }

  export const isBoolean: (value: any) => IIsBoolean;

  export interface IIsNumber {
    isNumber?: boolean;
  }

  export const isNumber: (value: any) => IIsNumber;
  export const isEmpty: (value: any) => boolean;
}
