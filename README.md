# NEEWE AI Framework — Source Repository

The development home of the **NEEWE Framework**: an 8-layer AI-assisted development system that turns any solo dev or small team into a 10× engineering squad via the principle *"Opus plans → Sonnet executes"*.

> 🏛️ **Companion repo:** [`NeeweTec/neewe-ai-marketplace`](https://github.com/NeeweTec/neewe-ai-marketplace) — published artifact that users install via `/plugin marketplace add NeeweTec/neewe-ai-marketplace`.

---

## What is NEEWE?

A unified Claude Code plugin that delivers:

| Layer | Mission |
|---|---|
| **L0 Foundation** | SessionStart bootstrap, Wizard Mode, project context absorption |
| **L1 Intelligence** | Opus planning, spec generation, architectural design |
| **L2 Orchestration** | Dynamic squad formation, task delegation, clean handoffs |
| **L3 Execution** | Goal-Mode continuous dev, TDD, Sonnet executors with worktree isolation |
| **L4 Memory (MNEME)** | CLAUDE.md hot + Obsidian vault + Graphify graph (queryable knowledge) |
| **L5 Extensibility** | Skills, Hooks, MCP, Plugins, Marketplace |
| **L6 Governance** | Triple-gate validation (QA + Tech Lead + PO) at every transition |
| **L7 Efficiency** | Model routing, token compression, hard cost caps (~$0.84/feature) |

**Bonus:** EP-OPUS-13 — Embedded Web Dashboard at `localhost:7878` for live observability.

---

## Repo Structure

```
neewe-ai-fw/
├── CLAUDE.md                    ← NEEWE's own NEEWE doctrine for self-build
├── README.md
├── LICENSE
├── docs/
│   ├── ARCHITECTURE.md          ← The 8-layer design (master extraction)
│   ├── CROSS-REFERENCE.md       ← Convergent patterns + conflicts + 5 architectural rules
│   ├── ENHANCEMENTS.md          ← The 13 EP-OPUS proposals
│   └── analysis/                ← Original 12 forensic source analyses
├── src/
│   ├── manifests/               ← EP-OPUS-1 Agent YAML manifests (single source of truth)
│   ├── skills/                  ← skill source authoring (TDD-for-prose)
│   ├── agents/                  ← compiled agents
│   ├── hooks/                   ← hook scripts (Bash/JS)
│   └── dashboard/               ← EP-OPUS-13 Web UI (Bun HTTP+WebSocket)
├── build/
│   ├── compile-manifests.ts     ← Agent Manifest compiler (EP-OPUS-1)
│   └── publish-to-marketplace.ts
├── evals/                       ← EP-OPUS-4 continuous eval harness (3-arm pattern)
├── sprints/
│   └── sprint-01.md             ← per-sprint execution plan
└── CONTRIBUTING.md
```

---

## Documentation Anchors

| Doc | What it answers |
|---|---|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Full 8-layer design, golden nuggets by layer, 6-sprint roadmap |
| [`docs/CROSS-REFERENCE.md`](./docs/CROSS-REFERENCE.md) | Convergent patterns across 12 sources, conflicts resolved into 5 architectural rules, synergy chains |
| [`docs/ENHANCEMENTS.md`](./docs/ENHANCEMENTS.md) | The 13 Opus-original architectural proposals + 5 wild cards + 3 anti-proposals |
| [`sprints/sprint-01.md`](./sprints/sprint-01.md) | Current sprint execution plan |

---

## Build + Publish Pipeline

```
[neewe-ai-fw]
   src/manifests/*.yaml     ──┐
   src/skills/*.md          ──┤
   src/agents/*.md          ──┤   build/compile-manifests.ts
   src/hooks/**             ──┼───────────────────────────────►   plugins/neewe-core/...
   src/dashboard/**         ──┤   build/publish-to-marketplace.ts
                            ──┘
                                                                  [neewe-ai-marketplace]
                                                                    ├── .claude-plugin/marketplace.json
                                                                    └── plugins/neewe-core/...
```

CI runs on tag pushes to publish the artifact.

---

## Current Status

**Phase:** Sprint 1 — Foundation (L0 + L5 scaffold). See [`sprints/sprint-01.md`](./sprints/sprint-01.md).

**Roadmap:** 6 sprints to v0.5.0 (production-ready beta). Full plan in [`docs/ARCHITECTURE.md#implementation-roadmap-6-sprints`](./docs/ARCHITECTURE.md).

---

## License

MIT — see [LICENSE](./LICENSE).

---

*Built by [NeeweTec](https://github.com/NeeweTec). Powered by Claude Opus 4.7 (1M context).*
