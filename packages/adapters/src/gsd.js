import path from "node:path";
import { checkCommand, detectFromPaths, installUiArtifacts, startPythonUi, runBootstrapCommands } from "./shared.js";

const DEFAULT_PATHS = ["/Users/me/Sites/get-shit-done"];

export const gsdAdapter = {
  name: "gsd",
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
      "npx get-shit-done-cc --help"
    ];
    const results = await runBootstrapCommands(commands, ctx);
    return {
      ok: results.length > 0 ? results.every(r => r.code === 0) : true,
      commands,
      results,
      note: ctx.dryRun 
        ? "GSD bootstrap is command-suggested. Execution skipped in dry-run." 
        : "GSD bootstrap auto-executed."
    };
  },
  async installUI(ctx) {
    return installUiArtifacts(ctx, "gsd");
  },
  async start(ctx) {
    const packagePath = path.resolve(ctx.repoRoot, "packages/ui-gsd");
    const port = ctx.port ?? 3006;
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
  async *streamEvents(ctx) {
    if (!ctx.wsPort) return;
    if (typeof WebSocket === "undefined") return;
    const ws = new WebSocket(`ws://127.0.0.1:${ctx.wsPort}`);
    for await (const message of ws) {
      yield {
        timestamp: Date.now(),
        source: "gsd-ws",
        type: "message",
        payload: message.toString()
      };
    }
  },
  async readSnapshot() {
    return { source: "filesystem", type: "snapshot" };
  }
};

