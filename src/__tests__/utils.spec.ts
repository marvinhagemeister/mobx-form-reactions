import * as t from "assert";
import { FieldStatus, getStatus, Field } from "..";

export function Fake(status: FieldStatus): Field {
  return {
    status,
  } as any;
}

describe("getStatus", () => {
  it("should abort on first invalid field", () => {
    t.equal(
      getStatus([
        Fake(FieldStatus.VALID),
        Fake(FieldStatus.PENDING),
        Fake(FieldStatus.INVALID),
      ]),
      FieldStatus.INVALID,
    );

    t.equal(
      getStatus([
        Fake(FieldStatus.VALID),
        Fake(FieldStatus.VALID),
        Fake(FieldStatus.PENDING),
      ]),
      FieldStatus.PENDING,
    );

    t.equal(
      getStatus([
        Fake(FieldStatus.VALID),
        Fake(FieldStatus.VALID),
        Fake(FieldStatus.VALID),
      ]),
      FieldStatus.VALID,
    );
  });
});
