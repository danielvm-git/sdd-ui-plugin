import path from "node:path";
import { checkCommand, detectFromPaths, installUiArtifacts, startPythonUi } from "./shared.js";

const DEFAULT_PATHS = ["/Users/me/Sites/spec-kit"];

export const specKitAdapter = {
  name: "spec-kit",
  async detect(ctx) {
    const foundPath = detectFromPaths([ctx.targetDir, ...DEFAULT_PATHS].filter(Boolean));
    const hasPython = await checkCommand("python3", ["--version"]).catch(() => false);
    return {
      installed: Boolean(foundPath),
      path: foundPath,
      version: null,
      diagnostics: [{ checkId: "python3", severity: hasPython ? "info" : "error", message: hasPython ? "python3 found" : "python3 missing" }]
    };
  },
  async bootstrap() {
    return {
      ok: true,
      commands: [
        "pipx install specify-cli"
      ],
      note: "Spec-Kit bootstrap is command-suggested. Adapter wiring can be expanded for auto-install."
    };
  },
  async installUI(ctx) {
    return installUiArtifacts(ctx, "spec-kit");
  },
  async start(ctx) {
    const packagePath = path.resolve(ctx.repoRoot, "packages/ui-spec-kit");
    const port = ctx.port ?? 3005;
    return startPythonUi({
      packagePath,
      port,
      projectPath: ctx.projectPath,
      apiBase: `http://127.0.0.1:${port}/api`
    });
  },
  async status() {
    return { health: "unknown", reason: "Runtime status inspection not yet implemented." };
  },
  async doctor(ctx) {
    const detection = await this.detect(ctx);
    return detection.diagnostics;
  },
  async *streamEvents() {
    return;
  },
  async readSnapshot() {
    return { source: "filesystem", type: "snapshot" };
  }
};

