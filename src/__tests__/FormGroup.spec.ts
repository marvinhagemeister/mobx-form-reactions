import { assert as t } from "chai";
import { useStrict, toJS } from "mobx";
import Field from "../Field";
import FormGroup from "../FormGroup";

useStrict(true);

const isHello = (value: string) => value !== "hello"
  ? { hello: true }
  : {};

describe("FormGroup", () => {
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
    const fb = new Field(null, { validator: isHello });
    const form = new FormGroup({ fa, fb });

    fb.setValue("yes");
    return form.validate()
      .then(() => t.equal(form.valid, false));
  });

  it("should getField by name", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa === fa, true);
  });

  it("should reset the FormGroup", () => {
    const foo = new Field({ validator: isHello });
    const form = new FormGroup({ foo });

    foo.setValue("nope");
    return form.validate()
      .then(() => {
        t.equal(form.valid, false);
        t.deepEqual(form.errors, {});
        t.deepEqual(foo.errors, {
          hello: true,
        });
      })
      .then(() => {
        form.reset();

        t.equal(form.valid, true);
        t.deepEqual(form.errors, {});
        t.deepEqual(foo.errors, {});
      });
  });

  it("should handle pending validation", () => {
    const validator = (value: any) =>
      new Promise((res, rej) => {
        setTimeout(() => res({}), 10);
      });

    const foo = new Field();
    const form = new FormGroup({ foo }, { validator });

    t.equal(form.validating, false);
    foo.setValue("");
    const p = form.validate();
    t.equal(form.validating, true);

    return p.then(() => {
      t.equal(form.validating, false);
    });
  });

  it.skip("should submit values", () => {
    // TODO
  });
});
