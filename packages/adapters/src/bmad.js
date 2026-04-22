import path from "node:path";
import { checkCommand, detectFromPaths, installUiArtifacts, startPythonUi, runBootstrapCommands } from "./shared.js";

const DEFAULT_PATHS = ["/Users/me/Sites/BMAD-METHOD"];

export const bmadAdapter = {
  name: "bmad",
  async detect(ctx) {
    const foundPath = detectFromPaths([ctx.targetDir, ...DEFAULT_PATHS].filter(Boolean));
    const hasBinary = await checkCommand("bmad-method", ["--version"]).catch(() => false);
    return {
      installed: Boolean(foundPath || hasBinary),
      path: foundPath || "global",
      version: null,
      diagnostics: [
        { checkId: "binary", severity: hasBinary ? "info" : "error", message: hasBinary ? "bmad-method found" : "bmad-method missing" }
      ]
    };
  },
  async bootstrap(ctx) {
    const isGlobal = ctx.scope === "global";
    const commands = [
      isGlobal ? "npm install -g bmad-method" : "npm install bmad-method"
    ];
    const results = await runBootstrapCommands(commands, {
      ...ctx,
      cwd: isGlobal ? undefined : ctx.projectPath
    });
    return {
      ok: results.length > 0 ? results.every(r => r.code === 0) : true,
      commands,
      results,
      note: isGlobal 
        ? "BMAD binary installed globally." 
        : `BMAD binary installed locally in ${ctx.projectPath}.`
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

