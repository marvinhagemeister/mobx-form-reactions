import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, Validator, ValidationError } from "./shapes";
import FormGroup from "./FormGroup";
import Field from "./Field";

export default class FieldArray implements AbstractFormControl {
  validator: Validator<any>;
  @observable disabled: boolean = false;
  @observable _validating: boolean = false;
  @observable fields: AbstractFormControl[] = [];
  @observable errors: ValidationError = {};

  constructor(fields?: AbstractFormControl[], options?: ControlOptions) {
    if (fields) {
      this.push(...fields);
    }

    if (options) {
      Object.assign(this, options);
    }
  }

  @computed get valid() {
    for (const field of this.fields) {
      if (!field.valid || field.validating) {
        return false;
      }
    }

    return true;
  }

  @computed get validating() {
    for (const field of this.fields) {
      if (field.validating) {
        return true;
      }
    }

    if (this._validating) {
      return true;
    }

    return false;
  }

  @action.bound setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound validate(): Promise<boolean> {
    this._validating = true;

    const p = Promise.all(
      this.fields.map(field => field.validate()),
    );

    if (!this.validator) {
      return p.then(() => {
        this._validating = false;
        this.errors = {};
        return this.valid;
      });
    }

    return p.then(() => this.validator(this.fields))
      .then((result: ValidationError) => {
        this._validating = false;
        Object.assign(this.errors, result);
        return this.valid;
      });
  }

  @action.bound removeAt(index: number) {
    this.fields.splice(index, 1);
  }

  @action.bound insert(index: number, field: AbstractFormControl) {
    this.fields.splice(index, 0, field);
  }

  @action.bound push(...fields: AbstractFormControl[]) {
    this.fields.push(...fields);
  }

  @action.bound reset() {
    this.fields.forEach(field => field.reset());
    this.errors = {};
  }

  @action.bound submit(): Object {
    if (this.disabled) {
      return [];
    }

    return this.fields
      .filter(item => !item.disabled)
      .map(item => item.submit(), []);
  }
}
