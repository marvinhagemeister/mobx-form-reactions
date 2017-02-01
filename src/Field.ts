import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, Validator, ValidationError } from "./shapes";

export default class Field implements AbstractFormControl {
  validator: Validator<any>;
  @observable errors: ValidationError = {};
  @observable initial: boolean = true;
  @observable disabled: boolean = false;
  @observable validating: boolean = false;
  @observable _value: any;
  @observable defaultValue: any = null;

  constructor(options?: ControlOptions);
  constructor(defaultValue: string | number | boolean | null, options?: ControlOptions);
  constructor(defaultValue?: string | number | boolean | null | ControlOptions, options?: ControlOptions) {
    if (typeof defaultValue !== "string" && typeof defaultValue !== "number"
      && typeof defaultValue !== "boolean" && defaultValue !== null) {
      options = defaultValue;
      defaultValue = null;
    }

    action("init", () => {
      this.defaultValue = defaultValue;
      Object.assign(this, options);
    })();
  }

  @computed get valid() {
    if (Object.keys(this.errors).length || this.validating) {
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

  @action reset() {
    this.initial = true;
    this._value = null;
    this.errors = {};
    this.validating = false;
  }

  @action setValue(value: any) {
    this.initial = false;
    this._value = value;
  }

  @action setDisabled(value: boolean) {
    this.disabled = value;
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

    this.validating = true;
    return (result as Promise<any>)
      .then(action("stop Validation", (res: ValidationError) => {
        this.validating = false;
        this.errors = res;
        return this.valid;
      }));
  }
}
