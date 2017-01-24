import { assert as t } from "chai";
import { useStrict } from "mobx";
import Field from "../Field";
import Form from "../Form";

useStrict(true);

describe("Form", () => {
  it("should initialize via constructor", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new Form([fa, fb]);

    t.equal(form.valid, true);
  });

  it("should return valid if fields are valid", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new Form();
    form.addFields(fa, fb);

    t.equal(form.valid, true);
  });

  it("should return invalid if one field is invalid", () => {
    const fa = new Field("a");
    const fb = new Field("b", { required: true });
    const form = new Form();
    form.addFields(fa, fb);

    fb.setValue("yes");
    fb.setValue("");

    t.equal(form.valid, false);
  });

  it("should add fields", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new Form();
    form.addFields(fa, fb);

    t.equal(Object.keys(form.fields).length > 0, true);
  });

  it("should getField by name", () => {
    const fa = new Field("foo");
    const fb = new Field("bar");
    const form = new Form();
    form.addFields(fa, fb);

    t.equal(form.fields["foo"].name, "foo");
    t.equal(form.fields["foo"] === fa, true);
  });
});
