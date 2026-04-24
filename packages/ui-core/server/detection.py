"""
Per-root SDD / method presence detection (stdlib only).

**Marker table (v1)** (filesystem checks; substrings in docstring for planning traceability):

- **GSD / planning:** `.planning/ROADMAP.md`, `.planning/STATE.md` (via `.planning` dir)
- **BMAD:** `.bmad/`
- **Spec-Kit:** `.specify/`
"""

from __future__ import annotations

import os
from typing import List


def detect_methods(project_root: str) -> List[str]:
    """
    Return installed methods in fixed order: GSD → BMAD → Spec-Kit, using short ids
    ``gsd``, ``bmad``, ``spec-kit`` (no duplicates).
    """
    if not project_root or not os.path.isdir(project_root):
        return []

    out: list[str] = []
    planning = os.path.join(project_root, ".planning")
    if os.path.isdir(planning):
        gsd = os.path.join(planning, "ROADMAP.md")
        st = os.path.join(planning, "STATE.md")
        if os.path.isfile(gsd) or os.path.isfile(st):
            out.append("gsd")

    bmad = os.path.join(project_root, ".bmad")
    if os.path.isdir(bmad):
        out.append("bmad")

    spec = os.path.join(project_root, ".specify")
    if os.path.isdir(spec):
        out.append("spec-kit")

    seen: set[str] = set()
    deduped: list[str] = []
    for m in out:
        if m not in seen:
            seen.add(m)
            deduped.append(m)
    return deduped
