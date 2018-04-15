import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, FieldStatus } from "./shapes";
import { getStatus } from "./utils";
import { Validator } from "./Validator";

export class FieldArray implements AbstractFormControl {
  private validator: Validator<FieldArray>;
  @observable disabled: boolean;
  @observable _validating: boolean = false;
  @observable fields: AbstractFormControl[] = [];
  @observable errors: string[] = [];

  constructor(
    fields: AbstractFormControl[] = [],
    {
      disabled = false,
      sync,
      async,
      bailFirstError,
    }: ControlOptions<FieldArray> = {},
  ) {
    this.disabled = disabled;
    this.validator = new Validator({ sync, async, bailFirstError });
    this.push(...fields);
  }

  @computed
  get status() {
    if (this.errors.length > 0) return FieldStatus.INVALID;
    if (this._validating) return FieldStatus.PENDING;
    return getStatus(this.fields);
  }

  @computed
  get value() {
    if (this.disabled) return [];

    const out = [];
    for (const field of this.fields) {
      if (!field.disabled) out.push(field.value);
    }
    return out;
  }

  @action.bound
  setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound
  validate(): Promise<void> {
    this._validating = true;

    const p = Promise.all(this.fields.map(field => field.validate()));
    return p.then(() => this.validator.run(this)).then(() => {
      this._validating = false;
    });
  }

  @action.bound
  removeAt(index: number) {
    this.fields.splice(index, 1);
  }

  @action.bound
  insert(index: number, field: AbstractFormControl) {
    this.fields.splice(index, 0, field);
  }

  @action.bound
  push(...fields: AbstractFormControl[]) {
    this.fields.push(...fields);
  }

  @action.bound
  reset() {
    this.fields.forEach(field => field.reset());
    this.errors = [];
    this._validating = false;
    return this.validate().then(() => undefined);
  }
}
