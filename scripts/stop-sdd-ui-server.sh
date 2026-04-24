#!/usr/bin/env bash
# Stop SDD UI HTTP servers by listening TCP port(s).
#
# Defaults: 3000 (unified dashboard, packages/ui-core) and 3006 (GSD UI, packages/ui-gsd).
# Pass explicit ports:  ./scripts/stop-sdd-ui-server.sh 3000
#                       ./scripts/stop-sdd-ui-server.sh 3000 5173
#
# Requires: lsof (macOS / Linux). Sends SIGTERM first.

set -euo pipefail

if ! command -v lsof >/dev/null 2>&1; then
  echo "error: lsof not found; install it or stop the server manually." >&2
  exit 1
fi

if [[ $# -gt 0 ]]; then
  ports=("$@")
else
  ports=(3000 3006)
fi

any=0
for port in "${ports[@]}"; do
  if [[ ! "$port" =~ ^[0-9]+$ ]]; then
    echo "error: not a valid port: $port" >&2
    exit 1
  fi
  found=0
  while read -r pid; do
    [[ -z "$pid" ]] && continue
    found=1
    any=1
    cmd=$(ps -p "$pid" -o comm= 2>/dev/null || echo "?")
    echo "Stopping PID $pid ($cmd) on port $port ..."
    kill -TERM "$pid" 2>/dev/null || true
  done < <(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
  if [[ "$found" -eq 0 ]]; then
    echo "Nothing listening on TCP port $port"
  fi
done

if [[ "$any" -eq 1 ]]; then
  echo "Done. If a process is still up, run again or use: kill -9 <pid>"
fi
