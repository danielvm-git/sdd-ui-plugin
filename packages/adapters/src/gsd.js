import path from "node:path";
import { checkCommand, detectFromPaths, installUiArtifacts, startPythonUi, runBootstrapCommands } from "./shared.js";

const DEFAULT_PATHS = ["/Users/me/Sites/get-shit-done"];

export const gsdAdapter = {
  name: "gsd",
  async detect(ctx) {
    const localAgent = path.join(ctx.projectPath, ".agent");
    const foundPath = detectFromPaths([ctx.targetDir, localAgent, ...DEFAULT_PATHS].filter(Boolean));
    const hasBinary = await checkCommand("get-shit-done-cc", ["--help"]).catch(() => false);
    return {
      installed: Boolean(foundPath || hasBinary),
      path: foundPath || "global",
      version: null,
      diagnostics: [
        { checkId: "binary", severity: hasBinary ? "info" : "error", message: hasBinary ? "get-shit-done-cc found" : "get-shit-done-cc missing" },
        { checkId: "local-agent", severity: Boolean(foundPath) ? "info" : "warn", message: Boolean(foundPath) ? ".agent folder found" : ".agent folder missing" }
      ]
    };
  },
  async bootstrap(ctx) {
    const isGlobal = ctx.scope === "global";
    const commands = [
      isGlobal 
        ? "npx get-shit-done-cc --antigravity --global" 
        : "npx get-shit-done-cc --antigravity --local"
    ];
    const results = await runBootstrapCommands(commands, {
      ...ctx,
      cwd: ctx.projectPath
    });
    return {
      ok: results.length > 0 ? results.every(r => r.code === 0) : true,
      commands,
      results,
      note: isGlobal 
        ? "GSD installed globally for Antigravity." 
        : `GSD installed locally in .agent folder.`
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

