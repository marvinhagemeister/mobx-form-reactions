import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, FieldStatus } from "./shapes";
import { getStatus } from "./utils";
import { Validator, IValidator } from "./Validator";

export class FieldArray implements AbstractFormControl {
  @observable disabled: boolean;
  @observable fields: AbstractFormControl[] = [];
  validator: IValidator<FieldArray>;

  constructor(
    fields: AbstractFormControl[] = [],
    {
      disabled = false,
      validator = new Validator(),
    }: ControlOptions<FieldArray> = {},
  ) {
    this.disabled = disabled;
    this.validator = validator;
    this.push(...fields);
  }

  @computed
  get initial() {
    return this.fields.every(x => x.initial);
  }

  @computed
  get revision() {
    return this.fields.reduce((rev, x) => (rev += x.revision), 0);
  }

  @computed
  get status() {
    const { errors, pending } = this.validator;
    if (errors.length > 0) return FieldStatus.INVALID;
    if (pending) return FieldStatus.PENDING;
    return getStatus(this.fields);
  }

  @computed
  get value() {
    if (this.disabled) return [];

    const out = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
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
    return Promise.all(this.fields.map(field => field.validate())).then(() =>
      this.validator.run(this),
    );
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
    this.validator.reset();
    return this.validate().then(() => undefined);
  }
}
