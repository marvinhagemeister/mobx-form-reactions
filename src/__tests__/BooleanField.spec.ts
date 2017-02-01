import { assert as t } from "chai";
import BooleanField from "../BooleanField";

describe("Checkbox", () => {
  it("should instantiate with default Options", () => {
    const field = new BooleanField();
    t.equal(field.defaultValue, false);
    t.equal(typeof field.validator, "function");

    const field2 = new BooleanField(true, { disabled: true });
    t.equal(field2.defaultValue, true);
    t.equal(field2.disabled, true);
  });

  it("should toggle", () => {
    const field = new BooleanField();
    t.equal(field.value, false);

    field.toggle();
    t.equal(field.value, true);
  });
});
