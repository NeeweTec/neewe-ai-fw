# Sprint 2 — Intelligence + Skill Authoring (L1 + L5 + EP-OPUS-1)

> **Goal:** every NEEWE agent has a single source of truth (manifest.json). First governance agent (`governance-tech-lead`) shipped via the compiler pipeline. Foundation for Sprint 3 squads.
> **Duration:** 1 week (solo senior) or 3 days (3-person squad)
> **Exit criteria:** Adding a new NEEWE agent = author one `manifest.json` + run compiler + push. Zero hand-edits of compiled `.md` files.

---

## Task List

### EP-OPUS-1 — Agent Manifest Compiler

- [x] **`build/compile-manifests.js`** — Node 18+ compiler (zero npm deps via native JSON, Node fs). Validates schema, emits `.md` files with frontmatter + compile marker.
- [x] **`docs/MANIFEST-SCHEMA.md`** — schema v1 + validation rules + CLI + when-to-add-an-agent guide.
- [x] **`build/build.sh`** — wired to call compiler before copying to marketplace.
- [x] **First manifest: `src/manifests/governance/tech-lead/manifest.json`** — demonstrates pipeline end-to-end, ships the L6 Tech Lead agent.
- [ ] **Manifest tests** — pressure scenarios at `src/manifests/governance/tech-lead/pressure-scenarios/*.md` (the meta-skill demands it).

### Phase-01 Squad Agents (via manifest pipeline)

The 4 Phase-01 pre-configured squads need their agents. Ship them in order of leverage:

- [x] **`governance-tech-lead`** (L6, opus, reviewer-with-bash) — done.
- [x] **`governance-qa`** (L6, sonnet, reviewer-with-bash) — done. 8 verification dimensions + test-quality audit + behavioral-coverage focus + false-positive catalog.
- [x] **`governance-po`** (L6, sonnet, research) — done. Dual-mode (PRIMARY collaborative / ADVERSARIAL fatal-flaw) + 6 YC forcing questions + anti-sycophancy rule.
- [ ] **`governance-cso`** (L6, opus, reviewer-with-bash) — security audit (deferred to Sprint 3).
- [x] **`neewe-opus-planner`** (L1, opus, research) — done. Mandatory `<think>` 10 triggers + preliminary info gathering + 20-min task granularity + multi-interpretation surfacing + push-back rule.
- [ ] **`neewe-pre-report-gate`** as a **skill** (not agent) — universal preamble for analytical agents.
- [ ] **`neewe-assumptions-analyzer`** (L1, sonnet) — Confident/Likely/Unclear evidence classification.
- [ ] **`neewe-squad-composer`** (L2, opus, read-only) — reads project state + recommends squad from catalog.

### Namespace Meta-Skills (Two-Stage Routing, EP-OPUS-1 derived)

GSD's pattern cuts skill listing tokens 95%. Add 6 namespace skills, each routes to concrete sub-skills:

- [ ] **`neewe-workflow/SKILL.md`** — phase transitions, goal mode, plan execution.
- [ ] **`neewe-quality/SKILL.md`** — TDD, verification, code review, governance gates.
- [ ] **`neewe-context/SKILL.md`** — L4 memory (vault, graph), context save/restore.
- [ ] **`neewe-ideate/SKILL.md`** — brainstorming, idea validation, market research.
- [ ] **`neewe-manage/SKILL.md`** — squad formation, status, cost reporting.
- [ ] **`neewe-project/SKILL.md`** — init, onboarding, brownfield mapping.

### Dev Kit (validator skills for skill authors)

- [ ] **`neewe-validate` skill** — wraps `node build/compile-manifests.js --check` + lints SKILL.md files (Description=WHEN heuristic, token budget, persuasion-matrix mismatch).
- [ ] **`docs/EXAMPLES.md`** — Karpathy-style anti-pattern gallery (❌/✅) referenced from `writing-neewe-skills` SKILL.md.

---

## Out of Sprint-2 Scope (deferred)

- Governance trio orchestration script (`governance-gate.sh`) — needs all 3 agents + `SubagentStop` hook wiring → **Sprint 3**.
- Squad Composer dynamic-formation logic → **Sprint 3**.
- Goal Mode integration → **Sprint 4**.
- L4 MNEME (vault, graph, lint pass) → **Sprint 5**.
- EP-OPUS-13 Dashboard → **Sprint 5**.

---

## Definition of Done

1. `node build/compile-manifests.js --check` exits 0 on all committed manifests.
2. Adding a new agent requires only: create `manifest.json` + `node build/compile-manifests.js <name>` + `bash build/build.sh` + commit/push.
3. Zero hand-edits of compiled `.md` files (anything in `src/neewe-core/agents/**` is build output).
4. All 4 governance trio agents (tech-lead, qa, po, cso) shipped.
5. `neewe-opus-planner` agent shipped.
6. 6 namespace meta-skills routing correctly.
7. `neewe-validate` skill catches WHAT-style descriptions before merge.

---

## Issues / Blockers

(Open issues in this section as they arise.)
