# NEEWE Architecture — Master Reference

> This document is the authoritative architecture spec for the NEEWE Framework.
>
> **Full content** is mirrored from the original master extraction at:
> `c:\NEEWE\fw-neewe-claude\03 - ANÁLISE\00-master-extraction.md`
>
> A formal export pipeline (`build/export-docs.ts`) will sync the canonical content into this repo on each release. Until then, refer to the source file in the analysis workspace.

---

## Quick Index

- **8 Layers** L0–L7 with mission and golden nuggets per layer
- **5 Architectural Rules** (R1–R5) resolving all cross-source conflicts
- **6-Sprint Roadmap** from scaffold to v0.5.0 beta
- **13 EP-OPUS Proposals** layered into the roadmap
- **Economic Projection**: ~$0.84/feature, ~3-hour unattended Goal Mode runs (6× cheaper than naive)

## Source-of-Truth

The full architecture lives in three companion documents:

1. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — this file (master extraction, golden nuggets by layer, 6-sprint roadmap)
2. [`CROSS-REFERENCE.md`](./CROSS-REFERENCE.md) — convergent patterns, conflicts, 5 architectural rules, synergy chains
3. [`ENHANCEMENTS.md`](./ENHANCEMENTS.md) — 13 NEEWE-original architectural proposals

## TODO

- [ ] Wire `build/export-docs.ts` to auto-sync from the analysis workspace
- [ ] Add Mermaid diagrams for each layer
- [ ] Cross-link golden nuggets to their implementing manifests/skills
