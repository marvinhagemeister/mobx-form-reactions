import { assert as t } from "chai";
import { useStrict } from "mobx";
import Field from "../Field";
import FormGroup from "../FormGroup";

useStrict(true);

describe("Form", () => {
  it("should initialize via constructor", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new FormGroup({ fa, fb });

    t.equal(form.valid, true);
  });

  it("should return valid if fields are valid", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new FormGroup({ fa, fb });

    t.equal(form.valid, true);
  });

  it("should return invalid if one field is invalid", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new FormGroup({ fa, fb });

    fb.setValue("yes");
    fb.setValue("");

    t.equal(form.valid, false);
  });

  it("should getField by name", () => {
    const fa = new Field("foo");
    const fb = new Field("bar");
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa.name, "foo");
    t.equal(form.fields.fa === fa, true);
  });

  it("should reset the FormGroup", () => {
    const fa = new Field("foo");
    const fb = new Field("bar");
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa.name, "foo");
    t.equal(form.fields.fa === fa, true);
  });
});
