import * as t from "assert";
import * as sinon from "sinon";
import { Validator } from "../Validator";
import { delay } from "./helpers";
import { Field } from "../Field";
import { toJS } from "mobx";

const fn = (spy: sinon.SinonSpy) => async (field: Field) => {
  spy();
  return field.value !== "hello" ? "hello" : undefined;
};

describe("Validator", () => {
  it("should instantiate with no options", () => {
    return new Validator();
  });

  it("should support async cancellation", async () => {
    const spy = sinon.spy();
    const v = new Validator<Field>({
      async: [() => delay(100) as any, fn(spy)],
    });

    const f = new Field();
    f.setValue("foo");
    f.setValue("hello");
    const p1 = v.run(f);
    const p2 = v.run(f);

    await Promise.all([p1, p2]);
    t.equal(spy.callCount, 1);
  });

  it("should not bail on first error", async () => {
    const v = new Validator<Field>({
      bailFirstError: false,
      sync: [
        x => (x.value !== "foo" ? "foo" : undefined),
        x => (x.value !== "bar" ? "bar" : undefined),
      ],
      async: [
        async x => (x.value !== "foo" ? "fooAsync" : undefined),
        async x => (x.value !== "bar" ? "barAsync" : undefined),
      ],
    });

    const f = new Field();
    f.setValue("baz");
    await v.run(f);

    t.deepEqual(toJS(v.errors), ["foo", "bar", "fooAsync", "barAsync"]);
  });

  it("should bail on first error", async () => {
    const v = new Validator<Field>({
      bailFirstError: true,
      sync: [
        x => (x.value !== "foo" ? "foo" : undefined),
        x => (x.value !== "bar" ? "bar" : undefined),
      ],
    });

    const f = new Field();
    f.setValue("baz");
    await v.run(f);

    t.deepEqual(toJS(v.errors), ["foo"]);

    const v2 = new Validator<Field>({
      bailFirstError: true,
      async: [
        async x => (x.value !== "foo" ? "fooAsync" : undefined),
        async x => (x.value !== "bar" ? "barAsync" : undefined),
      ],
    });

    await v2.run(f);
    t.deepEqual(toJS(v2.errors), ["fooAsync"]);
  });

  it("should forward non-aborted errors", async () => {
    const v = new Validator<Field>({
      sync: [
        x => {
          throw new Error("fail");
        },
      ],
    });

    const f = new Field();
    f.setValue("baz");
    try {
      await v.run(f);
    } catch (err) {
      t.equal(err.message, "fail");
    }

    const v2 = new Validator<Field>({
      async: [
        async x => {
          throw new Error("fail");
        },
      ],
    });

    try {
      await v2.run(f);
    } catch (err) {
      t.equal(err.message, "fail");
    }
  });
});
