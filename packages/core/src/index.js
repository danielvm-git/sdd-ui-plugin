import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";

export const METHODS = ["bmad", "gsd", "spec-kit"];

export function resolveMethod(input) {
  if (!METHODS.includes(input)) {
    throw new Error(`Unsupported method "${input}". Expected one of: ${METHODS.join(", ")}`);
  }
  return input;
}

export function ensurePort(value, fallback) {
  const candidate = Number.parseInt(String(value ?? fallback), 10);
  if (Number.isNaN(candidate) || candidate <= 0) {
    return fallback;
  }
  return candidate;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export function manifestPath(projectPath) {
  return path.join(projectPath, ".sdd-ui", "install-manifest.json");
}

export async function writeManifest(projectPath, content) {
  const folder = path.join(projectPath, ".sdd-ui");
  await ensureDir(folder);
  await fs.writeFile(manifestPath(projectPath), JSON.stringify(content, null, 2), "utf8");
}

export async function readManifest(projectPath) {
  try {
    const raw = await fs.readFile(manifestPath(projectPath), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: options.stdio ?? "pipe",
      shell: options.shell ?? false
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr
      });
    });
  });
}

export function spawnDetached(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    detached: true,
    stdio: "ignore",
    shell: false
  });
  child.unref();
  return child.pid;
}

export async function openBrowser(url) {
  const { exec } = await import("node:child_process");
  const platform = process.platform;
  let command;

  if (platform === "darwin") {
    command = `open "${url}"`;
  } else if (platform === "win32") {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        console.error(`Failed to open browser: ${error.message}`);
      }
      resolve();
    });
  });
}

