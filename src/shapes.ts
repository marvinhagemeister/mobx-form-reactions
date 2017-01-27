export interface FieldCache {
  [key: string]: AbstractFormControl;
}

export interface AbstractFormControl {
  valid: boolean;
  name: string;
}

export interface FieldOptions {
  disabled?: boolean;
  validator?: Validator<any>;
}

export interface ValidationError {
  [error: string]: any;
}

export type ValidationResult = ValidationError | null;
export type Validator<T> = (value: T) => ValidationResult | Promise<ValidationResult>;
