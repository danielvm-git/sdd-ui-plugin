import os from "node:os";
import path from "node:path";
import { METHODS, resolveMethod, ensurePort, readManifest } from "@sdd-ui/core";
import { getAdapter } from "@sdd-ui/adapters";

const argv = process.argv.slice(2);
const command = argv[0] ?? "help";
const flags = parseFlags(argv.slice(1));
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../../");

const COMMANDS = {
  bootstrap: runBootstrap,
  install: runInstall,
  start: runStart,
  status: runStatus,
  doctor: runDoctor,
  version: runVersion,
  help: runHelp
};

COMMANDS[command]?.(flags).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

function parseFlags(args) {
  const options = {};
  const positionals = [];
  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }
    const key = token.replace(/^--/, "");
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
    } else {
      options[key] = next;
      i += 1;
    }
  }
  return { ...options, _: positionals };
}

function selectedMethods(flags) {
  const target = flags._[0] ?? "all";
  if (target === "all") return METHODS;
  return [resolveMethod(target)];
}

function baseCtx(flags) {
  const targetDir = flags["target-dir"] ? path.resolve(flags["target-dir"]) : undefined;
  const projectPath = flags.project ? path.resolve(flags.project) : targetDir ?? process.cwd();
  return {
    repoRoot,
    targetDir,
    projectPath,
    pluginSource: flags["plugin-source"] ?? "local",
    wsPort: flags["ws-port"] ? Number(flags["ws-port"]) : undefined,
    dryRun: Boolean(flags["dry-run"])
  };
}

async function runBootstrap(flags) {
  const ctx = baseCtx(flags);
  for (const method of selectedMethods(flags)) {
    const adapter = getAdapter(method);
    const detection = await adapter.detect(ctx);
    if (detection.installed && !flags["force-bootstrap"]) {
      console.log(`[${method}] detected at ${detection.path}`);
    } else {
      console.log(`[${method}] bootstrap starting...`);
      const bootstrap = await adapter.bootstrap(ctx);
      if (ctx.dryRun) {
        console.log(`[${method}] bootstrap planned (dry-run):`);
        for (const line of bootstrap.commands ?? []) console.log(`  - ${line}`);
      } else {
        for (const res of bootstrap.results ?? []) {
          const status = res.code === 0 ? "SUCCESS" : "FAILED";
          console.log(`  [${status}] ${res.command}`);
          if (res.code !== 0 && res.stderr) {
            console.error(`    Error: ${res.stderr.trim()}`);
          }
        }
      }
      if (bootstrap.note) console.log(`  note: ${bootstrap.note}`);
    }
    const installed = await adapter.installUI(ctx);
    console.log(`[${method}] UI installed: ${installed.ok ? "yes" : "no"}`);
  }
}

async function runInstall(flags) {
  const ctx = baseCtx(flags);
  for (const method of selectedMethods(flags)) {
    const adapter = getAdapter(method);
    const detection = await adapter.detect(ctx);
    if (!detection.installed) {
      throw new Error(`${method} is not detected. Run "sdd-ui bootstrap ${method}" first.`);
    }
    const result = await adapter.installUI(ctx);
    console.log(`[${method}] install complete (${result.ok ? "ok" : "failed"})`);
  }
}

async function runStart(flags) {
  const method = resolveMethod(flags._[0] ?? "");
  const adapter = getAdapter(method);
  const ctx = baseCtx(flags);
  const detection = await adapter.detect(ctx);
  if (!detection.installed && !flags["auto-bootstrap"]) {
    throw new Error(`${method} not detected. Use "sdd-ui bootstrap ${method}" or --auto-bootstrap.`);
  }
  if (!detection.installed && flags["auto-bootstrap"]) {
    await adapter.bootstrap(ctx);
    await adapter.installUI(ctx);
  }
  const port = ensurePort(flags.port, method === "bmad" ? 3007 : method === "gsd" ? 3006 : 3005);
  const start = await adapter.start({ ...ctx, port });
  console.log(`${method} backend pid: ${start.pid}`);
  console.log(`${method} api: ${start.apiBase}`);
  console.log(`${method} ui: ${start.uiUrl}`);

  const shouldUseLive = Boolean(flags.live);
  if (shouldUseLive) {
    const stream = adapter.streamEvents({ ...ctx, port });
    if (!stream || typeof stream[Symbol.asyncIterator] !== "function") {
      console.log(`[${method}] live stream unavailable, falling back to filesystem snapshots.`);
      const snapshot = await adapter.readSnapshot(ctx);
      console.log(`[${method}] fallback snapshot source: ${snapshot.source}`);
      return;
    }
    try {
      const timeoutMs = 4000;
      const firstEvent = await Promise.race([
        stream.next(),
        new Promise((resolve) => setTimeout(() => resolve({ done: true, value: null }), timeoutMs))
      ]);
      if (!firstEvent || firstEvent.done) {
        console.log(`[${method}] no live events received, using filesystem fallback.`);
        const snapshot = await adapter.readSnapshot(ctx);
        console.log(`[${method}] fallback snapshot source: ${snapshot.source}`);
      } else {
        console.log(`[${method}] live event channel active.`);
      }
    } catch {
      console.log(`[${method}] live stream failed, using filesystem fallback.`);
      const snapshot = await adapter.readSnapshot(ctx);
      console.log(`[${method}] fallback snapshot source: ${snapshot.source}`);
    }
  }
}

async function runStatus(flags) {
  const methods = selectedMethods(flags);
  const ctx = baseCtx(flags);
  for (const method of methods) {
    const manifest = await readManifest(ctx.projectPath);
    console.log(`[${method}] manifest: ${manifest ? "present" : "missing"}`);
    const adapter = getAdapter(method);
    const status = await adapter.status(ctx);
    console.log(`[${method}] status: ${status.health} (${status.reason})`);
  }
}

async function runDoctor(flags) {
  const methods = selectedMethods(flags);
  const ctx = baseCtx(flags);
  console.log(`OS: ${os.platform()} ${os.release()}`);
  for (const method of methods) {
    const adapter = getAdapter(method);
    const report = await adapter.doctor(ctx);
    console.log(`[${method}] checks:`);
    for (const check of report) {
      console.log(`  - [${check.severity}] ${check.checkId}: ${check.message}`);
    }
  }
}

async function runVersion() {
  console.log("sdd-ui 0.1.0");
  console.log("source: local");
}

async function runHelp() {
  console.log("sdd-ui commands:");
  console.log("  sdd-ui bootstrap <bmad|gsd|spec-kit|all> [--target-dir <path>] [--dry-run]");
  console.log("  sdd-ui install <bmad|gsd|spec-kit|all> [--project <path>]");
  console.log("  sdd-ui start <bmad|gsd|spec-kit> --project <path> [--port <number>] [--auto-bootstrap]");
  console.log("  sdd-ui status <bmad|gsd|spec-kit|all> [--project <path>]");
  console.log("  sdd-ui doctor <bmad|gsd|spec-kit|all> [--target-dir <path>]");
  console.log("  sdd-ui version");
}

