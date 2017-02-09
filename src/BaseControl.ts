
import { action, computed, observable } from "mobx";
import { AbstractFormControl, ControlOptions, Validator, ValidationError } from "./shapes";

export default class BaseControl {
  @observable errors: ValidationError = {};
  @observable initial: boolean = true;
  @observable disabled: boolean = false;
  @observable protected _validating: boolean = false;

  @action.bound setInitial(value: boolean) {
    this.initial = value;
  }

  @action.bound setDisabled(value: boolean) {
    this.disabled = value;
  }

  @action.bound setValidating(value: boolean) {
    this._validating = value;
  }

  @action.bound reset() {
    this.initial = true;
    this.errors = {};
    this._validating = false;
  }

  @action.bound addErrors(errors: ValidationError) {
    Object.assign(this.errors, errors);
  }

  removeError(key: string): void;
  @action.bound removeError(errors: string | ValidationError): void {
    if (typeof errors === "string") {
      if (this.errors[errors]) {
        delete this.errors[errors];
      }
    } else {
      Object.keys(errors).forEach(error => {
        if (this.errors[error]) {
          delete this.errors[error];
        }
      });
    }
  }
}
