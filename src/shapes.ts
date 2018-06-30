import { IValidator } from "./Validator";

export enum FieldStatus {
  VALID = "valid",
  INVALID = "invalid",
  PENDING = "pending",
}

export interface AbstractFormControl {
  disabled: boolean;
  status: FieldStatus;
  value: any;
  initial: boolean;
  revision: number;
  reset(): Promise<void>;
  validate(): Promise<void>;
  setDisabled(value: boolean): void;
}

export interface ControlOptions<T extends AbstractFormControl> {
  disabled?: boolean;
  validator?: IValidator<T>;
}
