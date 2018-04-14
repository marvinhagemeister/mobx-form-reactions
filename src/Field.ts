import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, FieldStatus } from "./shapes";
import { Validator } from "./Validator";

export type FieldValue = string | number | boolean | null;

export interface FieldOptions extends ControlOptions<Field> {
  value?: FieldValue;
}

export class Field implements AbstractFormControl {
  @observable errors: string[] = [];
  @observable initial: boolean = true;
  @observable disabled: boolean = false;
  @observable _validating: boolean = false;
  @observable value: FieldValue;

  private validator: Validator<Field>;
  private defaultValue: FieldValue;

  constructor({
    value = null,
    disabled = false,
    async,
    bailFirstError,
    sync,
  }: FieldOptions = {}) {
    this.validator = new Validator({ async, sync, bailFirstError });
    this.defaultValue = value;
    this.value = value;
    this.disabled = disabled;
  }

  @computed
  get status() {
    if (this.disabled || this.errors.length === 0) {
      return FieldStatus.VALID;
    } else if (this._validating) {
      return FieldStatus.PENDING;
    }
    return FieldStatus.INVALID;
  }

  @action.bound
  reset() {
    this.initial = true;
    this.value = this.defaultValue;
    this.errors = [];
    this._validating = false;
    return this.validate().then(() => undefined);
  }

  @action.bound
  setValue(value: FieldValue) {
    this.initial = false;
    this.value = value;
  }

  @action.bound
  setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound
  validate(): Promise<boolean> {
    return this.validator.run(this);
  }
}
