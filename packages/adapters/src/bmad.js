import path from "node:path";
import { checkCommand, detectFromPaths, installUiArtifacts, startPythonUi, runBootstrapCommands } from "./shared.js";

const DEFAULT_PATHS = ["/Users/me/Sites/BMAD-METHOD"];

export const bmadAdapter = {
  name: "bmad",
  async detect(ctx) {
    const foundPath = detectFromPaths([ctx.targetDir, ...DEFAULT_PATHS].filter(Boolean));
    const hasNode = await checkCommand("node").catch(() => false);
    return {
      installed: Boolean(foundPath),
      path: foundPath,
      version: null,
      diagnostics: [{ checkId: "node", severity: hasNode ? "info" : "error", message: hasNode ? "node found" : "node missing" }]
    };
  },
  async bootstrap(ctx) {
    const commands = [
      "npx bmad-method install"
    ];
    const results = await runBootstrapCommands(commands, ctx);
    return {
      ok: results.length > 0 ? results.every(r => r.code === 0) : true,
      commands,
      results,
      note: ctx.dryRun 
        ? "BMAD bootstrap is command-suggested. Execution skipped in dry-run." 
        : "BMAD bootstrap auto-executed."
    };
  },
  async installUI(ctx) {
    return installUiArtifacts(ctx, "bmad");
  },
  async start(ctx) {
    const packagePath = path.resolve(ctx.repoRoot, "packages/ui-bmad");
    const port = ctx.port ?? 3007;
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

