import * as t from "assert";
import { BooleanField } from "../BooleanField";

describe("Checkbox", () => {
  it("should instantiate with default Options", () => {
    const field = new BooleanField();
    t.equal(field.value, false);

    const field2 = new BooleanField({ value: true, disabled: true });
    t.equal(field2.value, true);
    t.equal(field2.disabled, true);

    const field3 = new BooleanField({ value: true });
    t.equal(field3.value, true);
    t.equal(field3.disabled, false);

    const field4 = new BooleanField({ value: false, disabled: true });
    t.equal(field4.disabled, true);
    t.equal(field4.value, false);
  });

  it("should toggle", () => {
    const field = new BooleanField();
    t.equal(field.value, false);

    field.toggle();
    t.equal(field.value, true);

    const field2 = new BooleanField({ value: false });
    t.equal(field2.value, false);

    field2.toggle();
    t.equal(field2.value, true);

    field2.setValue(false);
    field2.toggle();
    t.equal(field2.value, true);
  });
});
