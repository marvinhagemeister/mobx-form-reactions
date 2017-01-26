import { assert as t } from "chai";
import * as index from "../index";

describe("index", () => {
  it("should export public api", () => {
    t.equal(Object.keys(index).length > 0, true);
  });
});
