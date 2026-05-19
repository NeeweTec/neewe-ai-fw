# NEEWE Agent Manifest Schema v1 (EP-OPUS-1)

> **Status:** Sprint 2 v0.1 — agent manifests only. Skill / hook / settings manifests come in later sprints.
>
> **Source-of-truth contract:** every NEEWE agent is defined by a single `manifest.json` at `src/manifests/<archetype>/<name>/manifest.json`. The compiler (`build/compile-manifests.js`) emits the corresponding Claude Code sub-agent file at `src/neewe-core/agents/<archetype>/<name>.md`. **Do NOT hand-edit the compiled `.md` files** — they carry a `NEEWE-MANIFEST-COMPILED` marker and will be overwritten on the next build.

---

## File Layout

```
src/manifests/
├── governance/
│   ├── tech-lead/manifest.json    → src/neewe-core/agents/governance/tech-lead.md
│   ├── qa/manifest.json
│   └── po/manifest.json
├── planning/
│   ├── opus-planner/manifest.json
│   └── assumptions-analyzer/manifest.json
├── execution/
│   └── sonnet-implementer/manifest.json
└── meta/
    ├── squad-composer/manifest.json
    └── phase-orchestrator/manifest.json
```

## Manifest Schema (v1)

```json
{
  "$schema": "neewe-manifest-v1",
  "agent": {
    "name": "<kebab-case-id>",
    "version": "<semver>",
    "layer": "L0|L1|L2|L3|L4|L5|L6|L7",
    "archetype": "governance|planning|execution|meta|tool|discovery",
    "description": "Use when ... (WHEN to invoke; NOT what it does — NEEWE-LAW)",
    "identity": "Multi-line system prompt body. Free-form markdown.",
    "model": "opus|sonnet|haiku|inherit|opusplan",
    "effort": "low|medium|high|xhigh|max",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "tools_archetype": "read-only|research|reviewer-with-bash|implementer|doc",
    "permission_mode": "default|acceptEdits|plan|auto|dontAsk|bypassPermissions",
    "isolation": "worktree|none",
    "memory": "project|user|local|none",
    "color": "red|blue|green|yellow|purple|orange|pink|cyan"
  },
  "distribution": {
    "ship_with": ["neewe-core"]
  }
}
```

### Field Reference

| Field | Required? | Notes |
|---|---|---|
| `agent.name` | ✅ | kebab-case lowercase; must be unique across NEEWE |
| `agent.version` | ✅ | semver |
| `agent.layer` | ✅ | one of L0-L7 |
| `agent.archetype` | ✅ | drives output dir (`agents/<archetype>/<name>.md`) |
| `agent.description` | ✅ | **WHEN to use**, never WHAT it does. Compiler warns on WHAT-style descriptions starting with `Runs/Implements/Handles/Performs/Generates/Manages/Provides/Computes/Builds`. |
| `agent.identity` | ✅ | full system prompt body. Use `\n` for line breaks in JSON. |
| `agent.model` | ✅ | `opus` for planners/governance/architects; `sonnet` for builders/reviewers; `haiku` for docs/lookup. Per ECC's 4/52/2 split. |
| `agent.tools` OR `agent.tools_archetype` | ✅ (exactly one) | Explicit array OR archetype enum. Archetypes (from SUB analysis + NEEWE extension): `read-only` = Read/Grep/Glob; `research` = +WebFetch/WebSearch; `reviewer-with-bash` = Read/Grep/Glob/Bash; `implementer` = +Write/Edit; `doc` = Read/Write/Edit/Glob/Grep/WebFetch/WebSearch. |
| `agent.effort` | optional | thinking budget |
| `agent.permission_mode` | optional | per-agent permission posture |
| `agent.isolation` | optional | `worktree` for safe parallel review |
| `agent.memory` | optional | persistent MEMORY.md scope |
| `agent.color` | optional | UX hint in terminals that render it |
| `distribution.ship_with` | optional | which plugin(s) bundle this agent (e.g. `["neewe-core"]`, `["neewe-stack-nextjs"]`) |

## Validation Rules (enforced by `compile-manifests.js --check`)

1. **kebab-case lowercase name** (`^[a-z][a-z0-9-]*$`)
2. **Required fields present** (name, version, layer, archetype, description, identity, model)
3. **Enum field values** match the schemas above
4. **Tools mutually exclusive**: `tools` OR `tools_archetype`, never both
5. **Description WHEN-not-WHAT heuristic**: warns if description starts with `Runs/Implements/Handles/Performs/Generates/Manages/Provides/Computes/Builds`. **The NEEWE-LAW is empirical** — descriptions that summarize WHAT cause Claude to skip the body (Superpowers analysis Nugget 14 / U3).

## Compile Pipeline

```
src/manifests/<archetype>/<name>/manifest.json
         │
         │ build/compile-manifests.js
         │ (zero npm deps; Node 18+)
         ▼
src/neewe-core/agents/<archetype>/<name>.md  (frontmatter + identity body + compile marker)
         │
         │ build/build.sh
         │ (or CI on tag push)
         ▼
plugins/neewe-core/agents/<archetype>/<name>.md  (in neewe-ai-marketplace)
         │
         │ /plugin install neewe-core@neewe
         ▼
Claude Code agent registry
```

## CLI

```bash
# Compile all manifests
node build/compile-manifests.js

# Validate without writing (useful in CI pre-commit)
node build/compile-manifests.js --check

# Compile a single agent by name
node build/compile-manifests.js governance-tech-lead
```

## When to add a new agent

1. `mkdir -p src/manifests/<archetype>/<name>` (lowercase, kebab-case)
2. Author `manifest.json` per schema above
3. Run `node build/compile-manifests.js <name>` — verify compile succeeds
4. Read the generated `.md` — sanity-check the frontmatter and identity render
5. Author pressure scenarios at `src/manifests/<archetype>/<name>/pressure-scenarios/*.md` (required for governance / discipline agents)
6. Run `bash build/build.sh` (publishes to marketplace)
7. Commit both repos

## What's NOT in v1 (planned for future sprints)

- **Skill manifests** — currently skills are authored directly at `src/neewe-core/skills/<name>/SKILL.md`. Sprint 3 may add `src/manifests/skills/<name>/manifest.json` with similar schema.
- **Hooks/settings patches** — currently `hooks/hooks.json` and `settings.json` are hand-authored. EP-OPUS-1 v2 will let manifests declare hook fragments and the compiler will merge them.
- **Tests stanza** — the EP-OPUS-1 design includes a `tests:` field referencing pressure scenarios + expected outcomes. v1 stores pressure scenarios as sibling files; the compiler doesn't yet validate them.
- **Contracts stanza** — `contracts.inputs` / `contracts.outputs` / `contracts.completion_marker` / `contracts.status_bus` for typed inter-agent communication. v1 leaves these in prose inside `identity`.
