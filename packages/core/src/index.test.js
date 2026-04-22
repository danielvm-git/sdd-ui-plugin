import test from "node:test";
import assert from "node:assert/strict";
import { ensurePort, resolveMethod } from "./index.js";

test("resolveMethod accepts supported methods", () => {
  assert.equal(resolveMethod("bmad"), "bmad");
});

test("ensurePort falls back when invalid", () => {
  assert.equal(ensurePort("nope", 3000), 3000);
});

