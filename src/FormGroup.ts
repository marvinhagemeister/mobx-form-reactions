import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, FieldStatus } from "./shapes";
import { getStatus } from "./utils";
import { Validator, IValidator } from "./Validator";

export class FormGroup<T extends object> implements AbstractFormControl {
  validator: IValidator<FormGroup<T>>;
  @observable disabled: boolean = false;
  @observable errors: string[] = [];
  @observable fields: T;
  @observable _validating: boolean = false;

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
    if (this.errors.length > 0) return FieldStatus.INVALID;
    if (this._validating) return FieldStatus.PENDING;
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
    for (const field of this.allFields) {
      field.reset();
    }

    this.errors = [];
    this._validating = false;
    return this.validate().then(() => undefined);
  }

  @action.bound
  validate(): Promise<void> {
    this.errors = [];
    this._validating = true;

    const p = Promise.all(this.allFields.map(field => field.validate()));
    return p.then(res => {
      return this.validator.run(this).then(() => {
        this._validating = false;
      });
    });
  }
}
