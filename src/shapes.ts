import Field from "./Field";

export interface FieldCache {
  [key: string]: AbstractFormControl;
}

export interface AbstractFormControl {
  disabled: boolean;
  errors: ValidationError;
  validating: boolean;
  valid: boolean;
  reset(): void;
  validate(): Promise<boolean>;
  setDisabled(value: boolean): void;
}

export interface LocalFormControls {
  [name: string]: Field;
}

export interface ControlOptions {
  disabled?: boolean;
  validator?: Validator<any>;
}

export interface BooleanFieldOptions {
  disabled?: boolean;
}

export interface ValidationError {
  [error: string]: any;
}

export type Validator<T> = (value: T) => ValidationError | Promise<ValidationError>;
