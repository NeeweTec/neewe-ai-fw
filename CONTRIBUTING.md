# Contributing to NEEWE

Thanks for your interest in NEEWE. This document describes how the framework is built and the rules for contributing.

## Repo Layout

- `neewe-ai-fw` (THIS repo) — source-of-truth: manifests, skills, agents, hooks, dashboard, evals, docs, build scripts
- `neewe-ai-marketplace` — published artifact: what users install via `/plugin install neewe-core@neewe`. **Do not edit there directly** — the CI here publishes there.

## Single Source of Truth

NEEWE follows EP-OPUS-1: **every agent has a single YAML manifest** at `src/manifests/<name>/manifest.yaml`. The compiler (`build/compile-manifests.ts`) emits:

- `src/skills/<name>/SKILL.md`
- `src/agents/<name>.md`
- entries in `src/hooks/hooks.json`
- entries in `src/settings.json`
- entries in `plugins/neewe-core/.claude-plugin/marketplace.json`

**Edit the manifest, not the compiled outputs.**

## Workflow

1. Pick a task from the active sprint plan (`sprints/sprint-NN.md`)
2. Branch: `git checkout -b feat/sprint-NN/<short-task-id>`
3. Plan mode on; write a failing test for skills (TDD-for-prose)
4. Implement; run `bun build/lint-manifest.ts <name>` before commit
5. Atomic commits (one logical change per commit; conventional commits format)
6. PR → triggers eval CI (when EP-OPUS-4 is live, Sprint 4)
7. Triple-gate review (QA + Tech Lead + PO) when agents are live, Sprint 3

## Style

- NEEWE Tone Spec applies to *all* user-facing text (skills, docs, error messages)
- No emojis unless explicitly requested
- `file_path:line_number` for every code reference
- No filler adverbs (genuinely, honestly, straightforward, actually, basically)
- Open with action, end with the next move

## License

By contributing, you agree your contributions are licensed under the MIT License of this repo.
