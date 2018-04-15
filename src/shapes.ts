import { ValidatorOptions } from "./Validator";

export enum FieldStatus {
  VALID = "valid",
  INVALID = "invalid",
  PENDING = "pending",
}

export interface AbstractFormControl {
  disabled: boolean;
  errors: string[];
  _validating: boolean;
  status: FieldStatus;
  value: any;
  reset(): Promise<void>;
  validate(): Promise<void>;
  setDisabled(value: boolean): void;
}

export interface ControlOptions<T extends AbstractFormControl>
  extends ValidatorOptions<T> {
  disabled?: boolean;
}
