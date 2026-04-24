"""
Parse ``.planning/STATE.md`` for dashboard focus fields (stdlib only).
"""

from __future__ import annotations

import hashlib
import os
import re
from typing import Any

_MAX_READ = 2 * 1024 * 1024


def _parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---"):
        return {}, text
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, text
    end = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end < 0:
        return {}, text
    fm: dict[str, str] = {}
    for line in lines[1:end]:
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"')
    body = "\n".join(lines[end + 1 :])
    if body.startswith("\n"):
        body = body[1:]
    return fm, body


def _focus_from_body(body: str) -> dict[str, str]:
    focus = {"phase": "", "plan": "", "status": "", "progress": ""}
    key_to_label = {
        "phase": "Phase",
        "plan": "Plan",
        "status": "Status",
        "progress": "Progress",
    }
    for line in body.splitlines():
        stripped = line.strip()
        for k, label in key_to_label.items():
            if focus[k]:
                continue
            m = re.search(rf"\*\*{re.escape(label)}\*\*\s*:?\s*(.+)$", stripped, re.I)
            if m:
                focus[k] = m.group(1).strip()
                continue
            m2 = re.search(
                rf"\*\*{re.escape(label)}[^*]*\*\*\s*(?:[—:\-–]\s*)?(.+)$", stripped
            )
            if m2:
                focus[k] = m2.group(1).strip()
    return focus


def parse_state_text(raw: str) -> dict[str, Any]:
    if not raw or not isinstance(raw, str):
        return {"error": "missing"}
    truncated = len(raw) > _MAX_READ
    if truncated:
        raw = raw[:_MAX_READ]
    h = hashlib.sha256()
    h.update(raw.encode("utf-8", errors="replace"))
    content_sha256 = h.hexdigest()
    meta, body = _parse_frontmatter(raw)
    return {
        "metadata": meta,
        "body": body,
        "focus": _focus_from_body(body),
        "content_sha256": content_sha256,
        "truncated": truncated,
    }


def parse_state(path: str) -> dict[str, Any]:
    if not path or not isinstance(path, str):
        return {"error": "missing"}
    if not os.path.isfile(path):
        return {"error": "missing"}
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            raw = f.read(_MAX_READ + 1)
    except OSError:
        return {"error": "read_failed"}
    return parse_state_text(raw)
