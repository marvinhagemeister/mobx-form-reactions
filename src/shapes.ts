export interface FieldCache {
  [key: string]: FieldBase;
}

export interface FieldBase {
  valid: boolean;
  name: string;
}

export interface FieldOptions {
  required?: boolean;
  disabled?: boolean;
  validator?: (value: any) => string[] | Promise<string[]>;
}

export type ValidationError = { [error: string]: any } | null;

/** Returns null on success */
export type Validator<T> = (value: T) => ValidationError | Promise<ValidationError>;
