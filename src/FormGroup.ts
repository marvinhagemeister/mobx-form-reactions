import { action, computed, autorun, observe, observable } from "mobx";
import Field from "./Field";
import FieldArray from "./FieldArray";
import {
  AbstractFormControl,
  FieldCache,
  ControlOptions,
  LocalFormControls,
  Validator,
  ValidationError,
} from "./shapes";

export default class FormGroup<T extends FieldCache> implements AbstractFormControl {
  validator: Validator<any>;
  @observable disabled: boolean = false;
  @observable errors: ValidationError = {};
  @observable fields: T;
  @observable private _validating: boolean = false;

  constructor(fields: T, options?: ControlOptions) {
    this.fields = fields;
    if (options) {
      Object.assign(this, options);
    }
  }

  @computed get valid() {
    for (const key of this.fieldKeys()) {
      if (!((this.fields as any)[key].valid)) {
        return false;
      }
    }

    if (Object.keys(this.errors).length || this.validating) {
      return false;
    }

    return true;
  }

  @computed get validating() {
    for (const key of this.fieldKeys()) {
      if ((this.fields as any)[key].validating) {
        return true;
      }
    }

    if (this._validating) {
      return true;
    }

    return false;
  }

  fieldKeys() {
    return Object.keys(this.fields);
  }

  @action.bound setValidating(value: boolean) {
    this._validating = value;
  }

  @action.bound setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound reset() {
    const keys = Object.keys(this.fields);
    for (const key of keys) {
      (this.fields as any)[key].reset();
    }

    this.errors = {};
    this._validating = false;
  }

  @action.bound validate(): Promise<boolean> {
    this._validating = true;

    const p = Promise.all(
      this.fieldKeys()
        .map(key => (this.fields as any)[key].validate()),
    );

    if (typeof this.validator === "undefined") {
      return p
        .then(() => {
          this._validating = false;
          this.errors = {};
        })
        .then(() => this.valid);
    }

    return p.then(() => this.validator(this.fields))
      .then((errors: ValidationError) => {
        this._validating = false;
        this.errors = errors;
        return this.valid;
      });
  }

  @action.bound submit() {
    if (this.disabled) {
      return {};
    }

    return this.fieldKeys().reduce((res, key) => {
      const item = this.fields[key];
      if (item.disabled) {
        return res;
      }

      res[key] = item.submit();

      return res;
    }, {} as any);
  }
}
