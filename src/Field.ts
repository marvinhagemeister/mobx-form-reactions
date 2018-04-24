import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, FieldStatus } from "./shapes";
import { Validator, IValidator } from "./Validator";

export type FieldValue = string | number | boolean | null;

export interface FieldOptions extends ControlOptions<Field> {
  value?: FieldValue;
  revision?: number;
}

export class Field implements AbstractFormControl {
  @observable errors: string[] = [];
  @observable initial: boolean = true;
  @observable disabled: boolean = false;
  @observable _validating: boolean = false;
  @observable value: FieldValue;
  @observable revision: number = 0;

  validator: IValidator<Field>;
  defaultValue: FieldValue;

  constructor({
    value = null,
    disabled = false,
    revision = 0,
    validator = new Validator(),
  }: FieldOptions = {}) {
    this.validator = validator;
    this.defaultValue = value;
    this.value = value;
    this.disabled = disabled;
    this.revision = revision;
  }

  @computed
  get status() {
    if (this.disabled || (!this._validating && this.errors.length === 0)) {
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
    this.revision = 0;
    return this.validate().then(() => undefined);
  }

  @action.bound
  setValue(value: FieldValue) {
    this.value = value;
    this.revision++;
  }

  @action.bound
  setInitial(value: boolean) {
    this.initial = value;
  }

  @action.bound
  setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound
  validate() {
    return this.validator.run(this);
  }
}
