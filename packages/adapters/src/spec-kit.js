import path from "node:path";
import { checkCommand, detectFromPaths, installUiArtifacts, startPythonUi, runBootstrapCommands } from "./shared.js";

const DEFAULT_PATHS = ["/Users/me/Sites/spec-kit"];

export const specKitAdapter = {
  name: "spec-kit",
  async detect(ctx) {
    const foundPath = detectFromPaths([ctx.targetDir, ...DEFAULT_PATHS].filter(Boolean));
    const hasBinary = await checkCommand("specify-cli", ["--version"]).catch(() => false);
    return {
      installed: Boolean(foundPath || hasBinary),
      path: foundPath || "global",
      version: null,
      diagnostics: [
        { checkId: "binary", severity: hasBinary ? "info" : "error", message: hasBinary ? "specify-cli found" : "specify-cli missing" }
      ]
    };
  },
  async bootstrap(ctx) {
    const isGlobal = ctx.scope === "global";
    const commands = [
      isGlobal ? "pipx install specify-cli" : "pip install specify-cli"
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
        ? "Spec-Kit binary installed globally via pipx." 
        : `Spec-Kit binary installed locally in ${ctx.projectPath}.`
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

