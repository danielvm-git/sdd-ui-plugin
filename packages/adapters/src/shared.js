import fs from "node:fs";
import path from "node:path";
import { runCommand, spawnDetached, writeManifest } from "@sdd-ui/core";

export function exists(targetPath) {
  return fs.existsSync(targetPath);
}

export function detectFromPaths(pathsToCheck) {
  for (const candidate of pathsToCheck) {
    if (exists(candidate)) {
      return candidate;
    }
  }
  return null;
}

export async function checkCommand(binary, args = ["--version"]) {
  const result = await runCommand(binary, args);
  return result.code === 0;
}

export async function installUiArtifacts(ctx, method) {
  const manifest = {
    method,
    installedAt: new Date().toISOString(),
    projectPath: ctx.projectPath,
    source: ctx.pluginSource ?? "local"
  };
  await writeManifest(ctx.projectPath, manifest);
  return { ok: true, manifest };
}

export function startPythonUi({ packagePath, port, projectPath, apiBase }) {
  const env = {
    ...process.env,
    SDD_UI_PORT: String(port),
    SDD_UI_PROJECT: projectPath,
    SDD_UI_API_BASE: apiBase
  };
  const pid = spawnDetached("python3", ["app.py"], { cwd: packagePath, env });
  const uiUrl = `file://${path.join(packagePath, "index.html")}`;
  return { pid, uiUrl, apiBase };
}

export async function runBootstrapCommands(commands, ctx) {
  const results = [];
  if (ctx.dryRun) return results;

  for (const cmd of commands) {
    const [binary, ...args] = cmd.split(" ");
    const result = await runCommand(binary, args, { shell: true });
    results.push({ command: cmd, ...result });
    if (result.code !== 0) break;
  }
  return results;
}

