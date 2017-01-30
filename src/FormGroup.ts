import { action, computed, autorun, observe, observable } from "mobx";
import Field from "./Field";
import FieldArray from "./FieldArray";
import {
  AbstractFormControl,
  FieldCache,
  FormGroupOptions,
  LocalFormControls,
  Validator,
  ValidationError,
} from "./shapes";

export default class FormGroup<T extends FieldCache> implements AbstractFormControl {
  validator: Validator<any>;
  @observable errors: ValidationError = {};
  @observable fields: T;
  @observable private _validating: boolean = false;

  constructor(fields: T, options?: FormGroupOptions) {
    action("init", () => {
      this.fields = fields;
      if (options) {
        Object.assign(this, options);
      }
    })();
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
    if (this._validating) {
      return true;
    }

    for (const key of this.fieldKeys()) {
      if ((this.fields as any)[key].validating) {
        return true;
      }
    }

    return false;
  }

  fieldKeys() {
    return Object.keys(this.fields);
  }

  @action setValidating(value: boolean) {
    this._validating = value;
  }

  @action reset() {
    const keys = Object.keys(this.fields);
    for (const key of keys) {
      (this.fields as any)[key].reset();
    }

    this.errors = {};
    this._validating = false;
  }

  @action.bound validate() {
    this._validating = true;

    const p = this.fieldKeys().reduce((seq, key) => {
      const field = (this.fields as any)[key];
      return seq.then(() => field.validate());
    }, Promise.resolve());

    if (typeof this.validator === "undefined") {
      return p;
    }

    return p.then(() => this.validator(this.fields))
      .then(action((errors: ValidationError) => {
        this._validating = false;
        this.errors = errors;
      }));
  }

  @action.bound submit() {
    return this.fieldKeys().reduce((res, key) => {
      const item = this.fields[key];

      if (item instanceof Field) {
        res[key] = (item as Field).value;
      } else if (item instanceof FieldArray) {
        res[key] = (item as FieldArray).submit();
      } else if (item instanceof FormGroup) {
        res[key] = (item as FormGroup<any>).submit();
      }

      return res;
    }, {} as any);
  }
}
