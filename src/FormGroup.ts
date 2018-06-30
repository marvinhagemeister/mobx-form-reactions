import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, FieldStatus } from "./shapes";
import { getStatus } from "./utils";
import { Validator, IValidator } from "./Validator";

export class FormGroup<T extends object> implements AbstractFormControl {
  validator: IValidator<FormGroup<T>>;
  @observable disabled: boolean = false;
  @observable fields: T;

  constructor(
    fields: T,
    {
      validator = new Validator(),
      disabled = false,
    }: ControlOptions<FormGroup<T>> = {},
  ) {
    this.fields = fields;
    this.validator = validator;
    this.disabled = disabled;
  }

  @computed
  get initial() {
    return this.allFields.every(x => x.initial);
  }

  @computed
  get revision() {
    return this.allFields.reduce((rev, x) => (rev += x.revision), 0);
  }

  @computed
  get status() {
    const { pending, errors } = this.validator;
    if (pending) return FieldStatus.PENDING;
    if (errors.length > 0) return FieldStatus.INVALID;
    return getStatus(this.allFields);
  }

  @computed
  private get allFields(): AbstractFormControl[] {
    return Object.keys(this.fields).map(key => (this.fields as any)[key]);
  }

  @computed
  get value() {
    if (this.disabled) return {};

    return Object.keys(this.fields).reduce<Record<string, any>>((res, key) => {
      const item = (this.fields as any)[key];
      if (!item.disabled) {
        res[key] = item.value;
      }
      return res;
    }, {});
  }

  @action.bound
  setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound
  reset() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.allFields.length; i++) {
      const field = this.allFields[i];
      field.reset();
    }

    this.validator.reset();
    return this.validate().then(() => undefined);
  }

  @action.bound
  validate(): Promise<void> {
    return Promise.all(this.allFields.map(field => field.validate())).then(() =>
      this.validator.run(this),
    );
  }
}
