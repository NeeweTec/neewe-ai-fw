# NEEWE Catalog Imports

> **Status:** Sprint 3 — partial. 8 of top-40 catalog agents fully ported as first-class NEEWE manifests; 32 remain available via `build/import-catalog-agent.js` for ad-hoc import as projects need them.

## Tier 1 — Fully Ported (with NEEWE overlay)

These are first-class NEEWE agents, hand-tuned with NEEWE overlays (Pre-Report Gate, Tone Spec, archetype-correct tools, completion markers). Available from `neewe-core` plugin.

| Agent | Source | NEEWE archetype | NEEWE layer | Model | Status |
|---|---|---|---|---|---|
| `architect-reviewer` | VoltAgent 04-quality-security | planning | L1 | opus | ✅ Sprint 3 |
| `fullstack-developer` | VoltAgent 01-core-development | execution (implementer) | L3 | sonnet | ✅ Sprint 3 |
| `frontend-developer` | VoltAgent 01-core-development | execution (implementer) | L3 | sonnet | ✅ Sprint 3 |
| `debugger` | VoltAgent 04-quality-security | execution (reviewer-with-bash) | L3 | sonnet | ✅ Sprint 3 |
| `test-automator` | VoltAgent 04-quality-security | execution (implementer) | L3 | sonnet | ✅ Sprint 3 |
| `business-analyst` | VoltAgent 08-business-product | research | L1 | sonnet | ✅ Sprint 3 |
| `project-idea-validator` | VoltAgent 10-research-analysis | research | L1 | sonnet | ✅ Sprint 3 |
| `market-researcher` | VoltAgent 10-research-analysis | research | L1 | sonnet | ✅ Sprint 3 |

## Tier 2 — Import-Ready (use `build/import-catalog-agent.js`)

These are documented as next-priority. Each can be auto-scaffolded via the import script and then hand-tuned before commit.

| Catalog agent | NEEWE intent | Suggested archetype | Suggested model | Priority |
|---|---|---|---|---|
| `backend-developer` | Server-side feature execution | implementer | sonnet | high |
| `api-designer` | REST/GraphQL design | research | sonnet | high |
| `microservices-architect` | Distributed system design | research | opus | high |
| `ui-designer` | Visual design specs | doc | sonnet | high |
| `ui-ux-tester` | Live UI flow testing | reviewer-with-bash | sonnet | high |
| `accessibility-tester` | WCAG / A11y compliance | reviewer-with-bash | haiku | medium |
| `ux-researcher` | User research synthesis | research | sonnet | medium |
| `competitive-analyst` | Competitor teardown | research | sonnet | high |
| `trend-analyst` | Emerging-trend forecasting | research | sonnet | medium |
| `research-analyst` | General research synthesis | research | sonnet | medium |
| `content-marketer` | SEO copy + marketing assets | doc | haiku | medium |
| `technical-writer` | API refs + user guides | doc | haiku | medium |
| `ai-writing-auditor` | Detect/rewrite AI-isms | reviewer-with-bash | opus | high |
| `compliance-auditor` | GDPR/HIPAA/SOC2/PCI | research | opus | conditional (regulated industries) |
| `performance-engineer` | Perf bottleneck analysis | reviewer-with-bash | sonnet | medium |
| `git-workflow-manager` | Branch/merge discipline | reviewer-with-bash | haiku | low |
| `refactoring-specialist` | Behavior-preserving refactor | implementer | sonnet | medium |
| `cloud-architect` | AWS/GCP/Azure design | research | sonnet | medium |
| `devops-engineer` | CI/CD + automation | implementer | sonnet | medium |
| `kubernetes-specialist` | K8s manifests + operations | implementer | sonnet | conditional |
| `docker-expert` | Containerization | implementer | sonnet | medium |
| `terraform-engineer` | IaC | implementer | sonnet | conditional |
| `sre-engineer` | Reliability engineering | reviewer-with-bash | sonnet | medium |
| `python-pro` | Python stack specialist | implementer | sonnet | conditional (Python projects) |
| `typescript-pro` | TS stack specialist | implementer | sonnet | conditional (TS projects) |
| `react-specialist` | React framework specialist | implementer | sonnet | conditional (React projects) |
| `nextjs-developer` | Next.js framework specialist | implementer | sonnet | conditional (Next.js projects) |
| `vue-expert` | Vue framework specialist | implementer | sonnet | conditional |
| `angular-architect` | Angular framework specialist | implementer | sonnet | conditional |
| `mobile-developer` | Mobile app development | implementer | sonnet | conditional |
| `flutter-expert` | Flutter / Dart | implementer | sonnet | conditional |
| `websocket-engineer` | Real-time features | implementer | sonnet | conditional |
| `ai-engineer` | AI/ML feature integration | research+implementer | sonnet | conditional |
| `llm-architect` | LLM-app architecture | research | opus | conditional |
| `prompt-engineer` | Prompt-quality engineering | research+doc | sonnet | conditional |
| `mlops-engineer` | ML pipeline ops | implementer | sonnet | conditional |
| `data-engineer` | Data pipeline construction | implementer | sonnet | conditional |
| `postgres-pro` | PostgreSQL specialist | reviewer-with-bash | sonnet | conditional |
| `incident-responder` | Production incident triage | reviewer-with-bash | opus | conditional |
| `chaos-engineer` | Resilience testing | reviewer-with-bash | sonnet | conditional |

## How to Import a Tier-2 Agent

```bash
# From the neewe-ai-fw repo root:
node build/import-catalog-agent.js \
  "../fw-neewe-claude/02 - ARTEFATOS/repos/awesome-subagents/categories/01-core-development/backend-developer.md" \
  execution
```

This produces a scaffolded `src/manifests/execution/backend-developer/manifest.json`.

**The scaffold is NOT ready to commit as-is.** You MUST review:

1. **`description`** — rewrite as `Use when ...` (WHEN trigger, not WHAT verb). The `neewe-validate-skills` linter will fail otherwise.
2. **`archetype` + `tools_archetype`** — confirm they match the agent's actual capabilities, not just the catalog's `tools:` string.
3. **`model`** — catalog defaults to `sonnet` for most agents; consider whether `opus` (for deep reasoning) or `haiku` (for cheap loops) better fits the role.
4. **`identity`** — review the imported body; cut narrative drift; add NEEWE-specific anti-patterns; ensure the completion marker matches the agent's domain (e.g. `## BACKEND_DEV_COMPLETE` not just `## BACKEND-DEVELOPER_COMPLETE`).
5. **Run** `node build/compile-manifests.js <name>` to validate the schema.
6. **Run** `node src/neewe-core/bin/neewe-validate-skills.js` to lint the resulting agent file (re-purposed for agent .md linting — the linter checks frontmatter on all .md files in the skills/agents tree).
7. **Commit** if all checks pass.

## Tier 3 — Vendored Catalog (104 remaining agents)

The full VoltAgent catalog (144 agents) is vendored at:

```
c:\NEEWE\fw-neewe-claude\02 - ARTEFATOS\repos\awesome-subagents\
```

Browse via `tree` or the [upstream README](https://github.com/VoltAgent/awesome-claude-code-subagents). Any agent there can be imported as a Tier-2 candidate when project demand arises.

## Tier 4 — NEEWE-Original Agents (no catalog parallel)

These agents exist only in NEEWE; no catalog import:

| Agent | Role |
|---|---|
| `neewe-squad-composer` | L2 meta — dynamic squad formation |
| `neewe-phase-orchestrator` | L2 meta — phase pipeline driver |
| `governance-tech-lead` | L6 — NEEWE Tech Lead (governance trio) |
| `governance-qa` | L6 — NEEWE QA (governance trio) |
| `governance-po` | L6 — NEEWE PO (governance trio + ADVERSARIAL mode) |
| `governance-cso` | L6 — NEEWE CSO (security audit) |
| `governance-release` | L6 — NEEWE Release Manager (Septeto) |
| `governance-doc` | L6 — NEEWE Doc Engineer (Septeto) |
| `governance-retro` | L6 — NEEWE Retrospective (Septeto) |
| `neewe-opus-planner` | L1 — NEEWE Opus Planner (XML skeleton + Devin `<think>` triggers) |

## Roadmap (Sprint 3.5 → Sprint 4)

- Tier 2 priority `high` agents (backend-developer, api-designer, microservices-architect, ui-designer, ui-ux-tester, competitive-analyst, ai-writing-auditor) become first-class in Sprint 3.5
- Conditional agents import as `neewe-stack-*` satellites in Sprint 6
- `neewe-cost-guard` (NEEWE-original, Tier 4) ships in Sprint 4
- `lgpd-compliance-auditor` (NEEWE-original variant of compliance-auditor) ships in Sprint 6 for LATAM enterprise tier

## Self-Service Import Workflow

For a developer who needs an agent that isn't in Tier 1:

```bash
cd c:/NEEWE/neewe-ai-fw

# 1. Pick the agent from the vendored catalog
ls "../fw-neewe-claude/02 - ARTEFATOS/repos/awesome-subagents/categories/"

# 2. Import (scaffold)
node build/import-catalog-agent.js \
  "../fw-neewe-claude/02 - ARTEFATOS/repos/awesome-subagents/categories/<cat>/<name>.md"

# 3. Review the manifest (rewrite description as WHEN-trigger, adjust model, tighten identity)
$EDITOR src/manifests/<archetype>/<name>/manifest.json

# 4. Compile
node build/compile-manifests.js <name>

# 5. Build to marketplace
bash build/build.sh

# 6. Commit
git add src/manifests/<archetype>/<name>/ src/neewe-core/agents/<archetype>/<name>.md
git commit -m "feat: import <name> agent from VoltAgent catalog"
git push
```

After push: open a PR; governance trio reviews; if PASS, the agent is published to `neewe-ai-marketplace` on the next tagged release.
