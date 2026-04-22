import test from "node:test";
import assert from "node:assert/strict";
import { getAdapter } from "./index.js";

test("adapter registry resolves gsd", () => {
  const adapter = getAdapter("gsd");
  assert.equal(adapter.name, "gsd");
});

