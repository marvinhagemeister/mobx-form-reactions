import { action } from "mobx";
import Field from "./Field";
import { isBoolean } from "./validations";
import { BooleanFieldOptions, ControlOptions } from "./shapes";

export default class BooleanField extends Field {
  constructor(options?: BooleanFieldOptions);
  constructor(defaultValue: boolean, options?: BooleanFieldOptions);
  constructor(defaultValue?: boolean | BooleanFieldOptions, options?: BooleanFieldOptions) {
    if (typeof defaultValue === "undefined") {
      options = {};
      defaultValue = false;
    } else if (typeof defaultValue !== "boolean") {
      options = defaultValue;
      defaultValue = false;
    }

    (options as ControlOptions).validator = isBoolean;
    super(defaultValue as boolean, options);
  }

  @action.bound toggle() {
    this.initial = false;
    if (this._value === null || typeof this._value === "undefined") {
      if (typeof this.defaultValue === "boolean") {
        this._value = !this.defaultValue;
      } else {
        this._value = true;
      }
    } else {
      this._value = !this._value;
    }
  }
}
