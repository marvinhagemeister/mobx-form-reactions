import Field from "./Field";

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
