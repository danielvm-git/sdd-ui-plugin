import { bmadAdapter } from "./bmad.js";
import { gsdAdapter } from "./gsd.js";
import { specKitAdapter } from "./spec-kit.js";

export const adapterRegistry = {
  bmad: bmadAdapter,
  gsd: gsdAdapter,
  "spec-kit": specKitAdapter
};

export function getAdapter(method) {
  const adapter = adapterRegistry[method];
  if (!adapter) {
    throw new Error(`No adapter registered for method "${method}"`);
  }
  return adapter;
}

