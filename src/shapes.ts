import Field from "./Field";

export interface FieldCache {
  [key: string]: AbstractFormControl;
}

export interface AbstractFormControl {
  errors: ValidationError;
  valid: boolean;
  reset(): void;
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

export type ValidationResult = ValidationError | null;
export type Validator<T> = (value: T) => ValidationResult | Promise<ValidationResult>;
