import { assert as t } from "chai";
import Field from "../Field";
import Form from "../Form";

describe("Form", () => {
  it("should return valid if fields are valid", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new Form([fa, fb]);

    t.equal(form.valid, true);
  });

  it("should return invalid if one field is invalid", () => {
    const fa = new Field("a");
    const fb = new Field("b", { required: true });
    const form = new Form([fa, fb]);

    fb.setValue("yes");
    fb.setValue("");

    t.equal(form.valid, false);
  });

  it("should add fields", () => {
    const fa = new Field("a");
    const fb = new Field("b");
    const form = new Form([fa, fb]);

    t.equal(form.fields.length > 0, true);
  });
});
