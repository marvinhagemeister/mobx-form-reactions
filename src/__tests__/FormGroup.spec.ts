import { assert as t } from "chai";
import { useStrict, toJS } from "mobx";
import Field from "../Field";
import FormGroup from "../FormGroup";

useStrict(true);

describe("Form", () => {
  it("should initialize via constructor", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.valid, true);
  });

  it("should return valid if fields are valid", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.valid, true);
  });

  it("should return invalid if one field is invalid", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    fb.setValue("yes");
    fb.setValue("");

    t.equal(form.valid, false);
  });

  it("should getField by name", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa === fa, true);
  });

  it("should reset the FormGroup", () => {
    const isHello = (value: string) => value !== "hello"
      ? { hello: true }
      : {};

    const foo = new Field({ validator: isHello });
    const form = new FormGroup({ foo });

    foo.setValue("nope");
    t.equal(form.valid, false);
    t.deepEqual(form.errors, {});
    t.deepEqual(foo.errors, {
      hello: true,
    });

    form.reset();

    t.equal(form.valid, true);
    t.deepEqual(form.errors, {});
    t.deepEqual(foo.errors, {});
  });
});
