import { action, computed, observable } from "mobx";
import BaseControl from "./BaseControl";
import { AbstractFormControl, ControlOptions, Validator, ValidationError } from "./shapes";

export default class Field extends BaseControl implements AbstractFormControl {
  validator: Validator<any>;
  @observable _value: any;
  @observable defaultValue: any = null;

  constructor(options?: ControlOptions);
  constructor(defaultValue: string | number | boolean | null, options?: ControlOptions);
  constructor(defaultValue?: string | number | boolean | null | ControlOptions, options?: ControlOptions) {
    super();
    if (typeof defaultValue !== "string" && typeof defaultValue !== "number"
      && typeof defaultValue !== "boolean" && defaultValue !== null) {
      options = defaultValue;
      defaultValue = null;
    }

    this.defaultValue = defaultValue;
    Object.assign(this, options);
  }

  @computed get valid() {
    if (!this.disabled && (Object.keys(this.errors).length || this._validating)) {
      return false;
    }

    return true;
  }

  get value() {
    if (this.initial &&
      (this._value === null || typeof this._value === "undefined" || !this._value.length) &&
      (this.defaultValue !== null)) {
      return this.defaultValue;
    }

    return this._value;
  }

  @action.bound reset() {
    this.initial = true;
    this._value = null;
    this.errors = {};
    this._validating = false;
  }

  @action.bound setValue(value: any, skipValidation?: boolean) {
    this.initial = false;
    this._value = value;

    if (!skipValidation) {
      this.validate();
    }
  }

  @action.bound setDefaultValue(value: any) {
    this.defaultValue = value;
  }

  @action.bound setValidating(value: boolean) {
    this._validating = value;
  }

  @action.bound validate(): Promise<boolean> {
    if (typeof this.validator === "undefined") {
      return Promise.resolve(true);
    }

    const result = this.validator(this._value);
    if (typeof (result as any).then !== "function") {
      this.errors = result;
      return Promise.resolve(this.valid);
    }

    this._validating = true;
    return (result as Promise<any>)
      .then(action("stop Validation", (res: ValidationError) => {
        this._validating = false;
        this.errors = res;
        return this.valid;
      }));
  }
}
