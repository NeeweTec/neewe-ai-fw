# Sprint 1 — Foundation (L0 + L5 Scaffold)

> **Goal:** `claude` opens with NEEWE manifest in context, custom voice, sane defaults.
> **Duration:** 1 week (solo senior) or 3 days (3-person squad)
> **Exit criteria:** `/plugin install neewe-core@neewe` works end-to-end on a fresh machine.

---

## Task List

### Marketplace + Plugin scaffold

- [x] Repo `neewe-ai-marketplace` initialized
- [x] `.claude-plugin/marketplace.json` shipped
- [x] `plugins/neewe-core/.claude-plugin/plugin.json` shipped
- [x] LICENSE + README + .gitignore
- [ ] CI workflow: publish on tag push (`v0.x.0`)

### `neewe-core` Sprint-1 contents

- [ ] **`hooks/session-start`** + **`hooks/run-hook.cmd`** (polyglot — copy verbatim from Superpowers, change payload)
- [ ] **`skills/using-neewe/SKILL.md`** — bootstrap payload (Karpathy 4 principles + Tone Spec 15 rules + Cardinal Rules + Layer map)
- [ ] **`settings.json`** — NEEWE Recommended Settings Bundle (CFG analysis, `opusplan` default + env vars + allow/ask/deny matrix)
- [ ] **`output-styles/neewe-startup.md`** — custom output style (NEEWE voice)
- [ ] **`skills/writing-neewe-skills/SKILL.md`** — meta-skill (TDD-for-prose + Persuasion matrix + Description-WHEN rule)
- [ ] **EP-OPUS-2 phase-state primitive**: `.neewe/state.json` schema + `bin/neewe set-phase` CLI + lockfile (O_EXCL)

### `neewe-ai-fw` dev infrastructure

- [x] Repo scaffold (`docs/`, `src/`, `build/`, `evals/`, `sprints/`)
- [x] CLAUDE.md self-build doctrine
- [x] ARCHITECTURE.md / CROSS-REFERENCE.md / ENHANCEMENTS.md (link-stubs)
- [ ] **`build/compile-manifests.ts`** stub (EP-OPUS-1 — minimum: copy `src/skills/` → `plugins/neewe-core/skills/`)
- [ ] **`build/publish-to-marketplace.ts`** stub (rsync `plugins/neewe-core/` → marketplace clone)
- [ ] **`build/lint-manifest.ts`** stub (SKILL.md linter — Description-WHEN check, persuasion-matrix audit, token-budget)

---

## Out of Sprint-1 Scope

- Governance trio agents → Sprint 3
- L4 MNEME (vault + graph) → Sprint 5
- Dashboard EP-OPUS-13 → Sprint 5
- Goal Mode integration → Sprint 4

---

## Definition of Done

1. Fresh machine: `git clone neewe-ai-marketplace && /plugin install neewe-core@neewe`
2. Open a Claude Code session → SessionStart hook fires → NEEWE manifest in `<EXTREMELY_IMPORTANT>` tag
3. `/output-style` shows `NEEWE Startup`
4. `/model` shows `opusplan`
5. `bin/neewe set-phase 01-spec` updates `.neewe/state.json` atomically
6. `writing-neewe-skills` SKILL.md loads on `/Skill writing-neewe-skills`

---

## Issues / Blockers

(None yet. Open issues in this section as they arise.)
